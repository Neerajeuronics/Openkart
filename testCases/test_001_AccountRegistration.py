from pageObjects.HomePage import HomePage
from pageObjects.AccountRegistrationPage import AccountRegistrationPage
from utilities.readProperties import ReadConfig
from utilities.customeLogger import LogGen

class Test_001_AccountReg:
    baseURL = ReadConfig.getApplicationURL() # get value from .ini file
    logger=LogGen.loggen()
    def test_account_reg(self,setup):
        self.logger.info("*** test_001_AccountRegistration started ")
        self.driver = setup
        self.driver.get(self.baseURL)
        self.driver.maximize_window()

        self.hp=HomePage(self.driver)
        self.hp.clickMyAccount()
        self.hp.clickRegister()
        self.regpage=AccountRegistrationPage(self.driver)

        self.regpage.setFirstName("John")
        self.regpage.setLastName("Canedy")
        self.regpage.setEmail("abcxyz76bnbn810@gmail.com")
        self.regpage.setTelephone("65656565")
        self.regpage.setPassword("abcxyz")
        self.regpage.setConfirmPassword("abcxyz")
        self.regpage.setPrivacyPolicy()
        self.regpage.clickContinue()
        self.confmsg=self.regpage.getconfirmationmsg()
        if self.confmsg=="Your Account Has Been Created!":
            assert True
            self.driver.close()
        else:
            self.driver.save_screenshot("..\\screenshots\\" + "test_account_reg.png")
            self.driver.close()
            assert False
        self.logger.info("*** test_001_AccountRegistration Completed ")




