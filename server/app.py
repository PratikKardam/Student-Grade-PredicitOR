from flask import Flask, app, request, jsonify
import joblib
import numpy as np
import pandas as pd
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

model = joblib.load("model.pkl")

@app.route("/")
def home():
    return "Welcome to the Student Grade Prediction API!"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    try:
        required_fields = [
            'sex','age','address','famsize','Pstatus',
            'Medu','Fedu','Mjob','Fjob','guardian', 'traveltime',
            'studytime','failures','Ssupport','Gsupport','feespaid',
            'ecactivities','internet','freetime','goout','health',
            'absences','G1','G2'
        ]
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400

        numeric_fields = [
            'age', 'Medu', 'Fedu', 'traveltime', 'studytime', 'failures',
            'Ssupport', 'Gsupport', 'feespaid', 'ecactivities', 'internet',
            'freetime', 'goout', 'health', 'absences', 'G1', 'G2'
        ]
        for field in numeric_fields:
            if field in data:
                data[field] = int(data[field])

        # Define category orders as in training
        address_categories = ['urban', 'rural']
        famsize_categories = ['LE3', 'GT3']
        Pstatus_categories = ['T', 'A']
        job_categories = ['teacher', 'health', 'services', 'at_home', 'other']
        guardian_categories = ['mother', 'father', 'other']

        def cat_code(value, categories):
            return categories.index(value) if value in categories else -1

        # Convert categorical fields to codes
        address_code = cat_code(data['address'], address_categories)
        famsize_code = cat_code(data['famsize'], famsize_categories)
        Pstatus_code = cat_code(data['Pstatus'], Pstatus_categories)
        Mjob_code = cat_code(data['Mjob'], job_categories)
        Fjob_code = cat_code(data['Fjob'], job_categories)
        guardian_code = cat_code(data['guardian'], guardian_categories)

        # Features
        features = {
            'parent_background': (data['Medu'] + data['Fedu']) / 2 + abs(Mjob_code - Fjob_code),
            'family_influence': famsize_code + Pstatus_code + guardian_code,
            'environment': (address_code / 2) + data['feespaid'],
            'study_motivation': data['studytime'] * data['freetime'],
            'academic_struggles': np.log1p(data['failures'] * data['absences']),
            'social_activity': ((data['Ssupport'] + data['Gsupport']) / 2) + ((data['ecactivities'] + data['internet']) / 2) + (data['freetime'] * data['goout']),
            'wellbeing': (data['health'] / 5) * (1 / (data['age'] + 1)),
            'academic_performance': (data['G1'] + data['G2']) / 2
        }

        input_df = pd.DataFrame([features])
        prediction = model.predict(input_df)[0]
        return jsonify({'predicted_G3': round(float(prediction), 2)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)
