import os
from flask import Flask, jsonify
from pymongo import MongoClient
from flask_cors import CORS
import os
from dotenv import load_dotenv  

load_dotenv()

app = Flask(__name__)
CORS(app) # Allow React to talk to this Python server

# Connect to the SAME MongoDB Database you used for Node.js
# (We will add the connection string in the next step)
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.get_database('test') # 'test' is the default name in MongoDB Atlas
tasks_collection = db.tasks

@app.route('/api/stats', methods=['GET'])
def get_stats():
    # 1. Get Total Task Count
    total_tasks = tasks_collection.count_documents({})

    # 2. Get Completed Task Count
    completed_tasks = tasks_collection.count_documents({"status": "Completed"})
    
    # 3. Get High Priority Count
    high_priority = tasks_collection.count_documents({"priority": "High"})

    # 4. Calculate Completion Percentage
    completion_rate = 0
    if total_tasks > 0:
        completion_rate = round((completed_tasks / total_tasks) * 100, 2)

    return jsonify({
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "high_priority": high_priority,
        "completion_rate": completion_rate
    })

if __name__ == '__main__':
    
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port)