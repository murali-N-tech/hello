const axios = require('axios');
const Bill = require('../models/Bill');
const { extractTextFromFile } = require('../services/ocrService');
const { getBillSummary } = require('../services/aiService');

// This function runs the main processing logic in the background.
const processBill = async (billId, filePath, language) => {
  try {
    // Step 1: Extract text from the file using OCR.
    const extractedText = await extractTextFromFile(filePath);
    await Bill.findByIdAndUpdate(billId, {
      extractedText,
      status: 'processing',
    });

    // Step 2: Get structured data and a summary from the AI service.
    const { structuredData, summary } = await getBillSummary(extractedText, language);
    await Bill.findByIdAndUpdate(billId, {
      aiSummary: summary,
      structuredData,
    });

    // Step 3: Anomaly Detection
    const currentBill = await Bill.findById(billId);
    const historicalBills = await Bill.find({
      userId: currentBill.userId,
      status: 'completed',
    }).sort({ uploadDate: -1 });

    if (historicalBills.length > 2 && structuredData.totalCost) {
      const historicalCosts = historicalBills.map(b => b.structuredData.totalCost);
      const currentCost = structuredData.totalCost;


      const anomalyResponse = await axios.post('https://voiceyourbill.onrender.com/detect', {
        historicalCosts,
        currentCost,
      });

      await Bill.findByIdAndUpdate(billId, {
        anomalyData: anomalyResponse.data,
      });

      try {
        const anomalyResponse = await axios.post('https://voiceyourbill-anomaly-detector.onrender.com/detect', { // Using deployed URL
          historicalCosts,
          currentCost,
        });
        await Bill.findByIdAndUpdate(billId, {
          anomalyData: anomalyResponse.data,
        });
      } catch (anomalyError) {
        console.error('Anomaly detection service failed:', anomalyError.message);
        // Continue without anomaly data if the service fails
      }

    }

    // Step 4: Mark as Completed
    await Bill.findByIdAndUpdate(billId, { status: 'completed' });

    console.log(`Processing complete for bill ID: ${billId} in language: ${language}`);
  } catch (error) {
    console.error(`Processing failed for bill ID: ${billId}`, error);
    await Bill.findByIdAndUpdate(billId, { status: 'failed' });
  }
};

// --- CONTROLLERS ---

exports.uploadBill = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a file.' });
  }

  try {
    const { language = 'English' } = req.body;

    const newBill = new Bill({
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      userId: req.user.id,
      language: language, // FIX: Save the selected language to the database
    });
    await newBill.save();

    res.status(202).json({
      message: `File uploaded. Processing has started in ${language}.`,
      billId: newBill._id,
    });

    processBill(newBill._id, newBill.filePath, language);
  } catch (error) {
    console.error('Error during initial file upload:', error);
    res.status(500).json({ message: 'Server error during file upload.' });
  }
};

exports.getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill || bill.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    res.status(200).json(bill);
  } catch (error) {
    console.error('Error fetching bill by ID:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const bills = await Bill.find({ userId: req.user.id })
      .sort({ 'structuredData.dueDate': -1 })
      .limit(12);

    res.status(200).json(bills);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
