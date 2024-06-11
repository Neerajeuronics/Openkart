import pytest
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service as ChromeService


@pytest.fixture()
def setup():
    # Check where ChromeDriver is being installed
    driver_path = ChromeDriverManager().install()
    print(f"ChromeDriver installed at: {driver_path}")

    # Initialize WebDriver options
    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized")

    # Initialize WebDriver instance with options and service
    service = ChromeService(driver_path)
    driver = webdriver.Chrome(service=service, options=options)

    yield driver
    driver.quit()
