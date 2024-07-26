# Use the official Python image as a base image
FROM python:3.9

# Set the working directory inside the container
WORKDIR /app

# Copy requirements.txt to the working directory
COPY requirements.txt ./

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application files
COPY . .

# Expose the port that Flask uses
EXPOSE 5000

# Command to run the Flask application
CMD ["python", "app.py"]
