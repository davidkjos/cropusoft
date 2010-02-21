import logging
import os
from google.appengine.ext.webapp import template
import time, Cookie


from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext import db
from datetime import date

class Applicant(db.Model):
  email = db.StringProperty()
  name = db.StringProperty()
  applicant = db.StringProperty()

class Seed(db.Model):
  email = db.StringProperty()
  name = db.StringProperty()
  seed = db.StringProperty()

class Insurance(db.Model):
  email = db.StringProperty()
  data = db.StringProperty()

class Treatment(db.Model):
  email = db.StringProperty()
  name = db.StringProperty()
  treatment = db.StringProperty()
  
class Purchase(db.Model):
  email = db.StringProperty()
  description = db.StringProperty()
  purchase = db.StringProperty()

class Ingredient(db.Model):
  application = db.StringProperty()
  email = db.StringProperty()
  field = db.StringProperty()
  ing_type = db.StringProperty()
  product = db.StringProperty()
  rate = db.StringProperty()
  acres = db.StringProperty()
  acre_units = db.StringProperty()
  cost = db.StringProperty()
  cost_units = db.StringProperty()
  crop_type = db.StringProperty()
  
  
class User(db.Model):
  firstName = db.StringProperty()
  lastName = db.StringProperty()
  email = db.StringProperty()
  password = db.StringProperty()
  autoLogin = db.StringProperty()
  status = db.StringProperty()
  id = db.StringProperty()

class Farm(db.Model):
  number = db.StringProperty()
  farm_creator_email = db.StringProperty() 

class FarmReference(db.Model):
  user_email = db.StringProperty()   
  farm_creator_email = db.StringProperty()
  number = db.StringProperty()
  
class Field(db.Model):
  user_id = db.StringProperty()
  field = db.StringProperty()

class FieldCropType(db.Model):
  farm = db.StringProperty() 
  farm_creator_email = db.StringProperty()
  field_name = db.StringProperty()
  year = db.StringProperty()
  crop_type = db.StringProperty()
  
  
class Product(db.Model):
  name = db.StringProperty() 
  app_type = db.StringProperty() 
  crop_type = db.StringProperty() 
  unit = db.StringProperty() 
  price = db.StringProperty() 
  meta = db.StringProperty()
  
  
class Planting(db.Model):
  email = db.StringProperty() 
  planting = db.StringProperty()  
  description = db.StringProperty()  
  
class Fertilize(db.Model):
  email = db.StringProperty() 
  fertilize = db.StringProperty()   
  
class Chemical(db.Model):
  email = db.StringProperty() 
  chemical = db.StringProperty()

class Harvest(db.Model):
  email = db.StringProperty() 
  harvest = db.StringProperty()  
  description = db.StringProperty()  

class Storage(db.Model):
  email = db.StringProperty() 
  storage = db.StringProperty()    

class Sale(db.Model):
  email = db.StringProperty() 
  sale = db.StringProperty() 
  description = db.StringProperty() 

class Receipt(db.Model):
  email = db.StringProperty() 
  receipt = db.StringProperty()     

class Payment(db.Model):
  email = db.StringProperty() 
  payment = db.StringProperty()     
  
class County(db.Model):
  name = db.StringProperty()
  polygon = db.TextProperty()
  
class Township(db.Model):
  north = db.StringProperty()
  west = db.StringProperty()
  name = db.StringProperty()
  county = db.StringProperty()
  polygon = db.TextProperty()
  
class Section(db.Model):
  number = db.StringProperty()
  township = db.StringProperty()
  county = db.StringProperty()
  north = db.StringProperty()
  west = db.StringProperty()
  polygon = db.TextProperty()
  

class Application(db.Model):
  name = db.StringProperty()
  email = db.StringProperty()
  date = db.DateProperty()

class AppField(db.Model):
  app_key = db.StringProperty()
  farm_key = db.StringProperty()
  field = db.StringProperty()
 
class AppProduct(db.Model):
  app_key = db.StringProperty()
  product = db.StringProperty()
  amount = db.StringProperty()
  price = db.StringProperty()

class MainPage(webapp.RequestHandler):
  def get(self):

    action = self.request.get('action')
    logging.error(action)
    logging.error(action)
    if action == 'signout':
      self.response.headers['Set-Cookie'] = 'email=none;'
    
    if action == 'getSignin':

      email = self.request.get('email')
      password = self.request.get('password')
      autologin = self.request.get('autologin')

      
      
      users = db.GqlQuery("SELECT * FROM User where email = :1 and password = :2", email, password )
      
      if users.count() > 0:
        if autologin == "true":
          self.response.headers['Set-Cookie'] = 'email='+email+";"
        else:
          self.response.headers['Set-Cookie'] = 'email=none;'
        logging.error("logging in .....")
      else:
        users = db.GqlQuery("SELECT * FROM User where email = :1", "davidkjos@yahoo.com" )
        for user in users:
          user.delete()
        newuser = User()
        newuser.email = "davidkjos@yahoo.com"
        newuser.firstName = "David"
        newuser.lastName = "Kjos"
        newuser.password = "troffer"
        newuser.put()
      
        self.error(666)
      
    if action == 'getinsurance':
      logging.error("get insurance2.....")
      email = self.request.get('email')
      insurances = db.GqlQuery("SELECT * FROM Insurance where email = :1", email)
      self.response.out.write('<insurances>')
      for insurance in insurances:
        logging.error(insurance.data)
        self.response.out.write(insurance.data)
      self.response.out.write('</insurances>')
      
        
    if action == 'getpurchases':  
      logging.error("get purchases.....")
      email = self.request.get('email')
      self.response.out.write('<purchases>')
      purchases = db.GqlQuery("SELECT * FROM Purchase where email = :1", email)
      for purchase in purchases:
        logging.error(purchase.purchase)
        self.response.out.write(purchase.purchase)
      self.response.out.write('</purchases>')  
      plantings = db.GqlQuery("SELECT * FROM Planting where email = :1", email)

   
    if action == 'getplantings':  
      logging.error("get plantings.....")
      email = self.request.get('email')
      self.response.out.write('<plantings>')
      plantings = db.GqlQuery("SELECT * FROM Planting where email = :1", email)
      for planting in plantings:
        logging.error(planting.planting)
        self.response.out.write(planting.planting)
      self.response.out.write('</plantings>')   
 
    if action == 'getapplicants':  
      logging.error("getapplicants.....")
      email = self.request.get('email')
      self.response.out.write('<applicants>')
      applicants = db.GqlQuery("SELECT * FROM Applicant where email = :1", email)
      for applicant in applicants:
        logging.error(applicant.applicant)
        self.response.out.write(applicant.applicant)
      self.response.out.write('</applicants>')         
     
    if action == 'getharvests':  
      logging.error("get harvests.....")
      email = self.request.get('email')
      self.response.out.write('<harvests>')
      harvests = db.GqlQuery("SELECT * FROM Harvest where email = :1", email)
      for harvest in harvests:
        logging.error(harvest.harvest)
        self.response.out.write(harvest.harvest)
      self.response.out.write('</harvests>')         
 
    if action == 'getfertilizers':  
      logging.error("get fertilizers.....")
      email = self.request.get('email')
      self.response.out.write('<fertilizers>')
      fertilizers = db.GqlQuery("SELECT * FROM Fertilize where email = :1", email)
      for fertilize in fertilizers:
        logging.error(fertilize.fertilize)
        self.response.out.write(fertilize.fertilize)
      self.response.out.write('</fertilizers>') 
      
    if action == 'getstorages':  
      logging.error("get storages.....")
      email = self.request.get('email')
      self.response.out.write('<storages>')
      storages = db.GqlQuery("SELECT * FROM Storage where email = :1", email)
      for storage in storages:
        logging.error(storage.storage)
        self.response.out.write(storage.storage)
      self.response.out.write('</storages>')
      
    if action == 'getsales':  
      logging.error("get sales.....")
      email = self.request.get('email')
      self.response.out.write('<sales>')
      sales = db.GqlQuery("SELECT * FROM Sale where email = :1", email)
      for sale in sales:
        logging.error(sale.sale)
        self.response.out.write(sale.sale)
      self.response.out.write('</sales>')        
 
      
    if action == 'getseeds':
      logging.error("get seeds.....")
      email = self.request.get('email')
      self.response.out.write('<seeds>')      
      seeds = db.GqlQuery("SELECT * FROM Seed where email = :1", email)
      for seed in seeds:
        logging.error(seed.seed)
        self.response.out.write(seed.seed)
      self.response.out.write('</seeds>') 
 
    if action == 'gettreatments':
      logging.error("get treatments.....")
      email = self.request.get('email')
      self.response.out.write('<treatments>')      
      treatments = db.GqlQuery("SELECT * FROM Treatment where email = :1", email)
      for treatment in treatments:
        logging.error(treatment.treatment)
        self.response.out.write(treatment.treatment)
      self.response.out.write('</treatments>') 
           
      
    if action == 'getpayments':  
      logging.error("get payments.....")
      email = self.request.get('email')
      self.response.out.write('<payments>')
      payments = db.GqlQuery("SELECT * FROM Payment where email = :1", email)
      for payment in payments:
        logging.error(payment.payment)
        self.response.out.write(payment.payment)
      self.response.out.write('</payments>') 

    if action == 'getreceipts':  
      logging.error("get receipts.....")
      email = self.request.get('email')
      self.response.out.write('<receipts>')
      receipts = db.GqlQuery("SELECT * FROM Receipt where email = :1", email)
      for receipt in receipts:
        logging.error(receipt.receipt)
        self.response.out.write(receipt.receipt)
      self.response.out.write('</receipts>') 
      
    if action == 'getchemicals':  
      logging.error("get chemicals.....")
      email = self.request.get('email')
      self.response.out.write('<chemicals>')
      chemicals = db.GqlQuery("SELECT * FROM Chemical where email = :1", email)
      for chemical in chemicals:
        logging.error(chemical.chemical)
        self.response.out.write(chemical.chemical)
      self.response.out.write('</chemicals>')        
      
    if action == 'getfields':
      email = self.request.get('email')
      logging.error("get fields.....")
      fields = db.GqlQuery("SELECT * FROM Field where farm_creator_email = :1", email )
      self.response.out.write('<fields>')
      
      for field in fields:
        logging.error(field.name)
        self.response.out.write('<field name="')
        self.response.out.write(field.name)
        self.response.out.write('" township="')
        self.response.out.write(field.township)
        self.response.out.write('" north="')
        self.response.out.write(field.north)
        self.response.out.write('" west="')
        self.response.out.write(field.west)
        self.response.out.write('" section="')
        self.response.out.write(field.section)
        self.response.out.write('" corn_yield="')
        self.response.out.write(field.corn_yield)
        self.response.out.write('" wheat_yield="')
        self.response.out.write(field.wheat_yield)
        self.response.out.write('" soybean_yield="')
        self.response.out.write(field.soybean_yield)
        self.response.out.write('" acreage="')
        self.response.out.write(field.acreage)
        self.response.out.write('" farm="')
        self.response.out.write(field.farm)
        self.response.out.write('">')
        self.response.out.write(field.polygon)
        self.response.out.write('</field>')
      self.response.out.write('</fields>')
    if action == 'getuser2':   
      logging.error("changing township numbers")
      townships = db.GqlQuery("SELECT * FROM Township where name = :1", "Garfield")
      for township in townships:
        logging.error("_____________________")
        logging.error(township.north)
        logging.error(township.west)
        logging.error("_____________________")
        township.north="148"
        township.west="54"
        township.put()
      townships = db.GqlQuery("SELECT * FROM Township where name = :1", "Morgan")
      for township in townships:
        township.north="148"
        township.west="53"
        township.put()
      townships = db.GqlQuery("SELECT * FROM Township where name = :1", "Buxton")
      for township in townships:
        township.north="148"
        township.west="52"
        township.put()
      townships = db.GqlQuery("SELECT * FROM Township where name = :1", "Stavenger")
      for township in townships:
        township.north="148"
        township.west="51"
        township.put()
      townships = db.GqlQuery("SELECT * FROM Township where name = :1", "Belmont")
      for township in townships:
        township.north="148"
        township.west="50"
        township.put()
        
        
        
      townships = db.GqlQuery("SELECT * FROM Township where name = :1", "Viking")
      for township in townships:
        township.north="147"
        township.west="54"
        township.put()
      townships = db.GqlQuery("SELECT * FROM Township where name = :1", "Lindaas")
      for township in townships:
        township.north="147"
        township.west="53"
        township.put()
      townships = db.GqlQuery("SELECT * FROM Township where name = :1", "Wold")
      for township in townships:
        township.north="147"
        township.west="52"
        township.put()
      townships = db.GqlQuery("SELECT * FROM Township where name = :1", "Ervin")
      for township in townships:
        township.north="147"
        township.west="51"
        township.put()
      townships = db.GqlQuery("SELECT * FROM Township where name = :1", "Bingham")
      for township in townships:
        township.north="147"
        township.west="50"
        township.put()
      
        
      townships = db.GqlQuery("SELECT * FROM Township where name = :1", "Roseville")
      for township in townships:
        township.north="146"
        township.west="54"
        township.put()
      townships = db.GqlQuery("SELECT * FROM Township where name = :1", "Mayville")
      for township in townships:
        township.north="146"
        township.west="53"
        township.put()
      townships = db.GqlQuery("SELECT * FROM Township where name = :1", "Norway")
      for township in townships:
        township.north="146"
        township.west="52"
        township.put()
      townships = db.GqlQuery("SELECT * FROM Township where name = :1", "El Dorado")
      for township in townships:
        township.north="146"
        township.west="51"
        township.put()
      townships = db.GqlQuery("SELECT * FROM Township where name = :1", "Caledonia")
      for township in townships:
        township.north="146"
        township.west="50"
        township.put()
        
      townships = db.GqlQuery("SELECT * FROM Township where name = :1", "Norman")
      for township in townships:
        township.north="145"
        township.west="54"
        township.put()
      townships = db.GqlQuery("SELECT * FROM Township where name = :1", "Blanchard")
      for township in townships:
        township.north="145"
        township.west="53"
        township.put()
      townships = db.GqlQuery("SELECT * FROM Township where name = :1", "Bloomfield")
      for township in townships:
        township.north="145"
        township.west="52"
        township.put()
      townships = db.GqlQuery("SELECT * FROM Township where name = :1", "Hillsboro")
      for township in townships:
        township.north="145"
        township.west="51"
        township.put()
      townships = db.GqlQuery("SELECT * FROM Township where name = :1", "Herberg")
      for township in townships:
        township.north="145"
        township.west="50"
        township.put()
        
      townships = db.GqlQuery("SELECT * FROM Township where name = :1", "Galesberg")
      for township in townships:
        township.north="144"
        township.west="54"
        township.put()
      townships = db.GqlQuery("SELECT * FROM Township where name = :1", "Greenfield")
      for township in townships:
        township.north="144"
        township.west="53"
        township.put()
      townships = db.GqlQuery("SELECT * FROM Township where name = :1", "Bohnsack")
      for township in townships:
        township.north="144"
        township.west="52"
        township.put()
      townships = db.GqlQuery("SELECT * FROM Township where name = :1", "Kelso")
      for township in townships:
        township.north="144"
        township.west="51"
        township.put()
      townships = db.GqlQuery("SELECT * FROM Township where name = :1", "Elm river")
      for township in townships:
        township.north="144"
        township.west="50"
        township.put()   
      
        
      fields = db.GqlQuery("SELECT * FROM Field")  
      for field in fields:
        logging.error("_____________________")
        logging.error(field.name)
        logging.error(field.township)
        logging.error(field.north)
        logging.error(field.west)
        logging.error("_____________________")
        townshipName=field.township
        townships = db.GqlQuery("SELECT * FROM Township where name =:1", townshipName)  
        for township in townships:
          logging.error("SETTING FIELD NUMS_________________")
          logging.error(field.name)
          logging.error(field.north)
          logging.error(field.west)
          logging.error("_____________________")
          field.north = township.north
          field.west = township.west
          field.put()
        
    if action == 'getuser':
      logging.error("getting users farms .....")
      
      
      email = self.request.get('email')
      logging.error(email)
      farms = db.GqlQuery("SELECT * FROM Farm where farm_creator_email = :1", email)
      self.response.out.write('<data>')      
      self.response.out.write('<farms>')
      for farm in farms:
        self.response.out.write('<farm number="')
        self.response.out.write(farm.number)
        self.response.out.write('" key="')
        self.response.out.write(farm.key())
        self.response.out.write('" creator_email="')
        self.response.out.write(farm.farm_creator_email)
        self.response.out.write('">')
        fields = db.GqlQuery("SELECT * FROM Field where farm_creator_email = :1 and farm = :2", "davidkjos@yahoo.com", farm.number )
        for field in fields:
          logging.error("___________________________________")
          logging.error(field.name)
          logging.error(field.acreage)
          logging.error("___________________________________")
          self.response.out.write('<field name="')
          self.response.out.write(field.name)
          self.response.out.write('" township="')
          self.response.out.write(field.township)
          self.response.out.write('" north="')
          self.response.out.write(field.north)
          self.response.out.write('" west="')
          self.response.out.write(field.west)
          self.response.out.write('" section="')
          self.response.out.write(field.section)
          self.response.out.write('" acreage="')
          self.response.out.write(field.acreage)
          self.response.out.write('" farm="')
          self.response.out.write(farm.number)
          
          
          self.response.out.write('">')
          self.response.out.write(field.polygon)
          ingredients = db.GqlQuery("SELECT * FROM Ingredient where field = :1", field.name )
          
          self.response.out.write('<ingredients>')
          for ingredient in ingredients:
            
            self.response.out.write('<ingredient application="')
            self.response.out.write(ingredient.application)
            self.response.out.write('" field="')
            self.response.out.write(ingredient.field)
            self.response.out.write('" rate="')
            self.response.out.write(ingredient.rate)
            self.response.out.write('" type="')
            self.response.out.write(ingredient.ing_type)
            self.response.out.write('" crop_type="')
            logging.error("((((((((((((((((((((((((((((((((((")
            logging.error(ingredient.crop_type)
            logging.error(ingredient.ing_type)
            self.response.out.write(ingredient.crop_type)
            self.response.out.write('" product="')
            self.response.out.write(ingredient.product)
            self.response.out.write('" acres="')
            self.response.out.write(ingredient.acres)
            self.response.out.write('" acre_units="')
            self.response.out.write(ingredient.acre_units)
            self.response.out.write('" cost="')
            self.response.out.write(ingredient.cost)
            self.response.out.write('" cost_units="')
            self.response.out.write(ingredient.cost_units)
            self.response.out.write('" />')
          self.response.out.write('</ingredients>')  
          self.response.out.write('</field>')
          
          
          sectionResult = db.GqlQuery("SELECT * FROM Section where township = :1 and number = :2", field.township, field.section )
          self.response.out.write('<section township="')
          self.response.out.write(field.township)
          self.response.out.write('" section="')          
          self.response.out.write(field.section)
          self.response.out.write('">')
          self.response.out.write('</section>')

          appFields = db.GqlQuery("SELECT * FROM AppField where field = :1", field.name )
          
       
        self.response.out.write('</farm>')
       
       
          
        
      self.response.out.write('</farms>') 
      
      self.response.out.write('<purchases>')
      purchases = db.GqlQuery("SELECT * FROM Purchase where email = :1", email)
      for purchase in purchases:
        logging.error(purchase.purchase)
        self.response.out.write(purchase.purchase)
      self.response.out.write('</purchases>')
        
      
      
     
      self.response.out.write('</data>')    
      logging.error("::::::::::::::::::::::::::::::::::::::") 
 
    if action == 'getSections':
      logging.error("get sections .....")
      townshipName = self.request.get('parameter')
      sections = db.GqlQuery("SELECT * FROM Section where township = :1", townshipName)
      self.response.out.write('<sections>')
      for section in sections:
        self.response.out.write("<section number='")
        self.response.out.write(section.number)
        self.response.out.write("' >")
        logging.error("asdasdasdasdasd")
        logging.error("asdasdasdasdasd")
        logging.error(section.polygon)
        self.response.out.write(section.polygon)
        self.response.ouct.write("</section>")
      self.response.out.write("</sections>")
    if action == 'getsection':
      logging.error("getsection.......")
      number = self.request.get('number')
      north = self.request.get('north')
      west = self.request.get('west')
      townships = db.GqlQuery("SELECT * FROM Township where north = :1 and west = :2 ", north, west)
      for township in townships:
        name = township.name
        logging.error("township name::::::::")
        logging.error(name)
        logging.error(number)
        sections = db.GqlQuery("SELECT * FROM Section where township = :1 and number = :2", name, number)
        for section in sections:
          logging.error(section.polygon)
        
          self.response.out.write('<section number="')
          self.response.out.write(section.number)
          self.response.out.write('">')
          self.response.out.write(section.polygon)
          self.response.out.write('</section>')  
    
      
    self.response.CacheControl = "no-cache"
    self.response.Expires = -1
    self.response.headers['Pragma'] = "no-cache"
    self.response.headers['Content-Type'] = "application/xml"
    

    
    if len(action) == 0:
      self.redirect("html/cropusoft_3.htm")


   
    
    
    
    
  
  def post(self):
    action = self.request.get('action')
    logging.error(action)

    if action == 'removeplanting':
      logging.error("removeplanting.....")
      description = self.request.get('description')
      email = self.request.get('email')
      plantings = db.GqlQuery("SELECT * FROM Planting where email = :1 and description = :2", email, description )
      
      for planting in plantings:
        planting.delete()
 
    if action == 'removeapplicant':
      logging.error("removeapplicant.....")
      name = self.request.get('name')
      email = self.request.get('email')
      applicants = db.GqlQuery("SELECT * FROM Applicant where email = :1 and name = :2", email, name )
      
      for applicant in applicants:
        applicant.delete()        
        
        
    if action == 'removesale':
      logging.error("removesale.....")
      description = self.request.get('description')
      email = self.request.get('email')
      sales = db.GqlQuery("SELECT * FROM Sale where email = :1 and description = :2", email, description )
      for sale in sales:
        sale.delete()
        
    if action == 'removeharvest':
      logging.error("removeharvest.....")
      description = self.request.get('description')
      email = self.request.get('email')
      logging.error(email)
      logging.error(description)
      harvests = db.GqlQuery("SELECT * FROM Harvest where email = :1 and description = :2", email, description )
      for harvest in harvests:
        harvest.delete()  
        
    if action == 'saveinsurance':
      logging.error("saveInsurance.....")
      insurance = Insurance()
      insurance.email = self.request.get('email')
      insurance.data = self.request.get('insurance')
      logging.error(insurance.data)
      insurance.put() 

    if action == 'saveseed':
      logging.error("saveseed.....")
      seed = Seed()
      seed.email = self.request.get('email')
      seed.name = self.request.get('name')
      seed.seed = self.request.get('seed')
      logging.error(seed.seed)
      seed.put()       
      
    if action == 'saveapplicant':
      logging.error("saveapplicant.....")
      applicant = Applicant()
      applicant.email = self.request.get('email')
      applicant.applicant = self.request.get('applicant')
      logging.error(applicant.applicant)
      applicant.put()       
  
    if action == 'savestorage':
      logging.error("saveStorage.....")
      storage = Storage()
      storage.email = self.request.get('email')
      storage.storage = self.request.get('storage')
      logging.error(storage.storage)
      storage.put()       
    
    if action == 'savesale':
      logging.error("saveSale.....")
      sale = Sale()
      sale.email = self.request.get('email')
      sale.description = self.request.get('description')
      sale.sale = self.request.get('sale')
      logging.error(sale.sale)
      sale.put()  
   
      
    if action == 'savepayment':
      logging.error("savepayment.....")
      payment = Payment()
      payment.email = self.request.get('email')
      payment.payment = self.request.get('payment')
      logging.error(payment.payment)
      payment.put() 
      
    if action == 'savetreatment':
      logging.error("savepayment.....")
      treatment = Treatment()
      treatment.email = self.request.get('email')
      treatment.name = self.request.get('name')
      treatment.treatment = self.request.get('treatment')
      logging.error(treatment.treatment)
      treatment.put() 
  
      
    if action == 'savereceipt':
      logging.error("savereceipt.....")
      receipt = Receipt()
      receipt.email = self.request.get('email')
      receipt.receipt = self.request.get('receipt')
      logging.error(receipt.receipt)
      receipt.put() 
            
      
      
    if action == 'saveharvest':
      logging.error("saveharvest.....")
      harvest = Harvest()
      harvest.email = self.request.get('email')
      harvest.description = self.request.get('description')
      harvest.harvest = self.request.get('harvest')
      logging.error(harvest.harvest)
      harvest.put()
      
    if action == 'savechemical':
      logging.error("saveChemical.....")
      chemical = Chemical()
      chemical.email = self.request.get('email')
      chemical.chemical = self.request.get('chemical')
      logging.error(chemical.chemical)
      chemical.put()       
      
      
    if action == 'saveFarm':
      logging.error("saveFarm.....")
      farm = Farm()
      farm.number = self.request.get('farm_number')
      farm.farm_creator_email = self.request.get('email')
      farm.put() 
    
    if action == 'saveCounty':
      county = County()
      logging.error("addCounty")
      county.name = self.request.get('name')
      logging.error(self.request.get('name'))
      county.polygon = self.request.get('polygon')
      logging.error(self.request.get('polygon'))
      county.put()
      
    if action == 'saveAppField':  
      logging.error("saving app field...")
      appField = AppField()
      appField.farm_key = self.request.get('farm_key')
      appField.app_key = self.request.get('app_key')
      appField.field = self.request.get('field')
      appField.put()
      
    if action == 'saveAppProduct':  
      logging.error("saving app product...")
      appProduct = AppProduct()
      appProduct.app_key = self.request.get('app_key')
      appProduct.product = self.request.get('product')
      appProduct.amount = self.request.get('amount')
      appProduct.price = self.request.get('price')
      appProduct.put()    
      
    if action == 'changeCrop':
      logging.error("changing crop type...")
      field = self.request.get('field')
      creator = self.request.get('creator')
      farm =  self.request.get('creator')
      cropType =  self.request.get('type')
    
      
      
      fieldCropTypes = db.GqlQuery("SELECT * FROM FieldCropType where field_name = :1", field )
      for fieldCropType in fieldCropTypes:
        fieldCropType.delete()
        
      fieldCropType = FieldCropType()
      fieldCropType = FieldCropType()
      fieldCropType.farm = farm
      fieldCropType.farm_creator_email = creator
      fieldCropType.field_name = field
      fieldCropType.crop_type = cropType
      fieldCropType.put()
      
      logging.error("getting again...")      
      cropTypeResult = db.GqlQuery("SELECT * FROM FieldCropType where field_name = :1", field )
      logging.error(cropTypeResult[0].crop_type)    
      
    if action == 'saveTownship':
      logging.error("saving township....")
      township = Township()
      township.name = self.request.get('name')
      logging.error(township.name)
      township.polygon = self.request.get('polygon')
      logging.error(township.polygon)
      township.county = "Traill"
      township.put()
    
      
    if action == 'saveSection':
      logging.error("saving section....")
      section = Section()
      section.number = self.request.get('number')
      section.township = self.request.get('township')
      section.county = self.request.get('county')
      section.polygon = self.request.get('polygon')
      section.put()

    if action == 'saveIngredient':
      logging.error("adding ingredient....")
      ingredient = Ingredient()
      ingredient.application = self.request.get('application')
      ingredient.email = self.request.get('email')
      logging.error(ingredient.email)
      ingredient.field = self.request.get('field')
      ingredient.ing_type = self.request.get('type')
      logging.error(")))))))))))))))))))))))))))))))))))))))))")
      logging.error(ingredient.ing_type)
      ingredient.rate = self.request.get('rate')
      logging.error(ingredient.field)
      ingredient.product = self.request.get('product')
      logging.error(ingredient.product)
      ingredient.acres = self.request.get('acres')
      logging.error(ingredient.acres)
      ingredient.acre_units = self.request.get('acre_units')
      logging.error(ingredient.acre_units)
      ingredient.cost = self.request.get('cost')
      logging.error(ingredient.cost)
      ingredient.cost_units = self.request.get('cost_units')
      logging.error(ingredient.cost_units)
      ingredient.crop_type = self.request.get('crop_type')
      logging.error(ingredient.crop_type)
      ingredient.put()
      
      
    if action == 'saveApplication':
      logging.error("adding application....")
      
      day = self.request.get('day')
      month = self.request.get('month')
      year = self.request.get('year')
      name = self.request.get('name')
      email = self.request.get('email')
      logging.error(day)
      logging.error(month)
      logging.error(year)
      logging.error(name)
      logging.error(email)
      
      appDate = date(int(year), int(month), int(day))
      logging.error(appDate)
      
      application = Application()
      application.date = appDate
      application.name = name
      application.email = email
      application.put()        
      
    
    if action == 'deleteApplication':
      logging.error("deleting application....")
      appName = self.request.get('name')
      logging.error(appName)
      applications = db.GqlQuery("SELECT * FROM Application where name= :1", appName)
      for application in applications:
        application.delete()
 
        
        
    if action == 'deleteField':
      logging.error("deleting field....")
      logging.error(self.request.get('name'))
      fields = db.GqlQuery("SELECT * FROM Field where name = :1", self.request.get('name'))
      for field in fields:
        farmNumber = field.farm
        logging.error("FARM NUMBER:")
        logging.error(farmNumber)
        otherFields = db.GqlQuery("SELECT * FROM Field where farm = :1", farmNumber)
        logging.error("--------------------------------")
        logging.error(farmNumber)
        logging.error(otherFields.count())
        logging.error("--------------------------------")
        if otherFields.count() == 1:
          logging.error("deleting farm....")
          logging.error(farmNumber)
          farms = db.GqlQuery("SELECT * FROM Farm where number = :1", farmNumber)
          for farm in farms:
            logging.error("deleting farm....")
            logging.error(farm.number)
            farm.delete()
            logging.error("deleted")
          
        logging.error("%%%%%%%%%%%%%%%%%%%%%%%%%%")
        
        cropTypes = db.GqlQuery("SELECT * FROM FieldCropType where field_name = :1", field.name )
        for cropType in cropTypes:
          cropType.delete()
        field.delete()
        

    if action == 'saveuser':
      logging.error("saving user .....")

      user = User()
      user.status = "guest"
      user.id = self.request.get('id')
      user.put()  
 
      
    if action == 'savepurchase':
      logging.error("savepurchase.....")
      purchase = Purchase()
      purchase.email = self.request.get('email')
      purchase.purchase = self.request.get('purchase')
      purchase.description = self.request.get('description')
      purchase.put()
      
    if action == 'saveplanting':
      logging.error("saveplanting.....")
      planting = Planting()
      planting.email = self.request.get('email')
      planting.description = self.request.get('description')
      planting.planting = self.request.get('planting')
      planting.put()
    
      
    if action == 'editplanting':
      email = self.request.get('email')
      description = self.request.get('description')
      logging.error("editplanting.....")
      plantings =  db.GqlQuery("SELECT * FROM Planting where email = :1 and description = :2", email, description)
      for planting in plantings:
        planting.planting = self.request.get('planting')
        planting.put()
    if action == 'editpurchase':
      email = self.request.get('email')
      description = self.request.get('description')
      logging.error("editpurchase.....")
      logging.error("**********************************************************")
      logging.error(email)
      logging.error(description)
      logging.error(self.request.get('purchase'))
      purchases =  db.GqlQuery("SELECT * FROM Purchase where email = :1 and description = :2", email, description)
      for purchase in purchases:
        logging.error("FOUND")
        purchase.purchase = self.request.get('purchase')
        purchase.put()  
      
    if action == 'savefield':
      logging.error("adding field.....")  
      field = Field()
      field.user_id = self.request.get('id')
      field.field = self.request.get('id')
      field.put()
      logging.error("field added")  

    
application = webapp.WSGIApplication(
                                     [('/', MainPage)],
                                     debug=True)

def main():
  run_wsgi_app(application)

if __name__ == "__main__":
  main()