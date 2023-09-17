from curses import flash
from flask import Flask, jsonify, redirect, render_template, request, url_for
from bson.objectid import ObjectId
import pymongo

app = Flask(__name__)

# Initialize the MongoClient
client = pymongo.MongoClient("mongodb://localhost:27017/")

# Access the MongoDB database
db = client['Details']

# Access the MongoDB collections
collection_flipkart = db['flipkart']
collection_gem = db['GeM']
collection_amazon = db['amazon']


users_collection = db['login/signup']
@app.route('/', methods=['GET'])
def search_form():
    return render_template('index3.html')

@app.route('/process_search', methods=['POST', 'GET'])
def process_search():
    if request.method == 'POST':
        user_query = request.form['user_query']
        
        # Search each MongoDB collection for documents with a partial match in the "Name" field
        flipkart_result = collection_flipkart.find_one({"Name": {"$regex": user_query, "$options": "i"}})
        gem_result = collection_gem.find_one({"Name": {"$regex": user_query, "$options": "i"}})
        amazon_result = collection_amazon.find_one({"Name": {"$regex": user_query, "$options": "i"}})
        
        return render_template('index2.html',
                               user_query=user_query,
                               flipkart_results=[flipkart_result] if flipkart_result else [],
                               gem_results=[gem_result] if gem_result else [],
                               amazon_results=[amazon_result] if amazon_result else [])
    
    return "No search query provided."

class User:
    def __init__(self, username, password):
        self.username = username
        self.password = password
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        # Check if the user exists in the database
        user = users_collection.find_one({'username': username})
        if user and user['password'] == password:
            flash('Login successful', 'success')
            return redirect(url_for('index'))
        else:
            flash('Login failed. Please check your credentials.', 'danger')
    
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Check if the username is already taken
        existing_user = users_collection.find_one({'username': username})
        if existing_user:
            flash('Username already taken. Please choose a different one.', 'danger')
        else:
            new_user = User(username=username, password=password)
            users_collection.insert_one(new_user.__dict__)
            flash('Signup successful. You can now log in.', 'success')
            return redirect(url_for('login'))

    return render_template('signup.html')


















app.route('/get_recommendations', methods=['GET'])
def get_recommendations():
    if request.method == 'GET':
        user_query = request.args.get('user_query')
        
        # Search the GeM database for product recommendations based on user input
        gem_results = collection_gem.find({"Name": {"$regex": user_query, "$options": "i"}})
        
        # Extract product names from the GeM results
        recommendations = [result['Name'] for result in gem_results]
        
        return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True)
