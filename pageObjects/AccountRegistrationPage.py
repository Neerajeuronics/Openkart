from selenium.webdriver.support import expected_conditions as EC
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.wait import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import NoSuchElementException



class AccountRegistrationPage:
    txt_username = "//input[@id='input-username']"
    txt_firstname = "//input[@id='input-firstname']"
    txt_lastname = "//input[@id='input-lastname']"
    txt_email = "//input[@id='input-email']"
    txt_country = "//select[@id='input-country']"
    txt_password = "//input[@id='input-password']"
    bdm_button = "//button[@class='btn btn-primary btn-lg hidden-xs']"

    def __init__(self, driver):
        self.driver = driver

    def setUsername(self, Urname):
        try:
            WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.XPATH, self.txt_username)))
            username_input = self.driver.find_element(By.XPATH, self.txt_username)
            username_input.clear()
            username_input.send_keys(Urname)

        except NoSuchElementException:
            print("Username input field not found on the page.")

    def setFirstName(self, fname):
        self.driver.find_element(By.XPATH, self.txt_firstname).send_keys(fname)

    def setLastName(self, lname):
        self.driver.find_element(By.XPATH, self.txt_lastname).send_keys(lname)

    def setEmail(self, email):
        self.driver.find_element(By.XPATH, self.txt_email).send_keys(email)

    def setCountryName(self, country=None):
        dropdown_element = self.driver.find_element(By.XPATH, self.txt_country)
        select = Select(dropdown_element)
        for option in select.options:
            print(option.text)
            if country is None or option.text == country:
                select.select_by_visible_text(option.text)  # Select the country
                time.sleep(1)

    def clickButton(self):
        self.driver.find_element(By.XPATH, self.bdm_button).click()





