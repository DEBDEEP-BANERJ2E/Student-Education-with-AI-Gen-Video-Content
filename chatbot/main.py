from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import json

app = Flask(__name__)
CORS(app)

# Load datasets
jobs_df = pd.read_csv('data/jobs.csv')
courses_df = pd.read_csv('data/courses.csv')
internships_df = pd.read_csv('data/internships.csv')
scholarships_df = pd.read_csv('data/scholarships.csv')
projects_df = pd.read_csv('data/projects.csv')

def get_recommendations(query):
    """Get personalized recommendations based on user query"""
    # Simple keyword matching for demo
    recommendations = {
        'jobs': [],
        'courses': [],
        'internships': [],
        'scholarships': [],
        'projects': []
    }
    
    # Search in jobs
    matching_jobs = jobs_df[
        jobs_df['Job Title'].str.contains(query, case=False, na=False) |
        jobs_df['Industry'].str.contains(query, case=False, na=False)
    ].head(2)
    recommendations['jobs'] = matching_jobs.apply(
        lambda x: {'title': x['Job Title'], 'company': x['Company Name']}, 
        axis=1
    ).tolist()

    # Search in courses
    matching_courses = courses_df[
        courses_df['Course Title'].str.contains(query, case=False, na=False) |
        courses_df['Category'].str.contains(query, case=False, na=False)
    ].head(2)
    recommendations['courses'] = matching_courses.apply(
        lambda x: {'title': x['Course Title'], 'institution': x['Institution']},
        axis=1
    ).tolist()

    # Search in internships
    matching_internships = internships_df[
        internships_df['Internship Title'].str.contains(query, case=False, na=False) |
        internships_df['Industry'].str.contains(query, case=False, na=False)
    ].head(2)
    recommendations['internships'] = matching_internships.apply(
        lambda x: {'title': x['Internship Title'], 'company': x['Company']},
        axis=1
    ).tolist()

    return recommendations

@app.route('/api/chatbot', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '').lower()
        
        # Generate recommendations
        recommendations = get_recommendations(user_message)
        
        # Generate response
        response = {
            'career_guidance': f"Based on your interest in '{user_message}', here are some suggestions:\n\n"
                             f"1. Explore relevant courses and certifications\n"
                             f"2. Look for internship opportunities\n"
                             f"3. Build practical experience through projects\n"
                             f"4. Network with professionals in the field",
            'recommendations': recommendations
        }
        
        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)