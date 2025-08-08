# anomaly-detector/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app) # Allow requests from our Node.js server

@app.route('/detect', methods=['POST'])
def detect_anomaly():
    data = request.get_json()

    if not data or 'historicalCosts' not in data or 'currentCost' not in data:
        return jsonify({'error': 'Invalid input data'}), 400

    historical_costs = data['historicalCosts']
    current_cost = data['currentCost']

    if len(historical_costs) < 3: # Need at least 3 data points for meaningful analysis
        return jsonify({
            'isAnomaly': False,
            'message': ''
        })

    # Use Pandas to calculate mean and standard deviation
    series = pd.Series(historical_costs)
    mean = series.mean()
    std_dev = series.std()

    # Define an anomaly as any value more than 2 standard deviations above the average
    # This is a common statistical method for outlier detection
    threshold = mean + (2 * std_dev)

    is_anomaly = current_cost > threshold
    message = ''

    if is_anomaly:
        message = f"Alert: This month's cost of ₹{current_cost:,.2f} is significantly higher than your average of ₹{mean:,.2f}."

    return jsonify({
        'isAnomaly': is_anomaly,
        'message': message
    })

if __name__ == '__main__':
    # Run on a different port than our Node.js and React apps
    app.run(debug=True, port=5002)