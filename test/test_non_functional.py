import time
import requests

# PERFORMANCE TESTING
def test_performance(url):
    start_time = time.time()
    response = requests.get(url)
    end_time = time.time()

    response_time = end_time - start_time
    print(f"Performance Test - Response time: {response_time:.4f} seconds")


# SCALABILITY TESTING
def load_test(url, num_requests):
    start_time = time.time()
    for _ in range(num_requests):
        response = requests.get(url)
        if response.status_code != 200:
            print(f"Error with response: {response.status_code}")
    end_time = time.time()

    total_time = end_time - start_time
    print(f"Scalability Test - Total time for {num_requests} requests: {total_time:.4f} seconds")


def scalability_test(url, start_requests, increment, max_requests):
    for num_requests in range(start_requests, max_requests + 1, increment):
        print(f"Scalability Test - Testing with {num_requests} requests")
        load_test(url, num_requests)
        time.sleep(5)  # Rest between tests to simulate gradual load increase


# USABILITY TESTING
def usability_testing():
    print("Usability Test - Please rate the system's usability (1 = Poor, 5 = Excellent):")
    feedback = input()
    if feedback == "5":
        print("Great! We're happy to hear that.")
    elif feedback == "1":
        print("Sorry to hear that! We'll work on improving it.")
    else:
        print(f"Thank you for your feedback: {feedback}")


# RELIABILITY TESTING
def reliability_test(url, duration_minutes):
    start_time = time.time()
    end_time = start_time + (duration_minutes * 60)
    
    while time.time() < end_time:
        response = requests.get(url)
        if response.status_code != 200:
            print(f"Error with response: {response.status_code}")
        time.sleep(1)  # Make requests every second

    print(f"Reliability Test - Completed for {duration_minutes} minutes")


# MAIN FUNCTION TO RUN ALL TESTS
def run_tests(url):
    print("\n--- Starting Non-Functional Tests ---")
    
    # Performance Test
    test_performance(url)

    # Scalability Test
    scalability_test(url, 10, 10, 100)  # Start at 10 requests, increment by 10, max 100 requests

    # Usability Test
    usability_testing()

    # Reliability Test
    reliability_test(url, 1)  # Test for 1 minute


# Run the tests on a specified URL (e.g., local server endpoint)
if __name__ == "__main__":
    test_url = 'http://127.0.0.1:5000/predict'  # Change to your URL
    run_tests(test_url)
