from email import message
import sqlite3
from typing import Dict, Text, Any, List
from rasa_sdk import Tracker
from rasa_sdk.executor import CollectingDispatcher, Action
from rasa_sdk.forms import FormValidationAction
from rasa_sdk.events import AllSlotsReset, SlotSet

con = sqlite3.connect('ticket.db')
cur = con.cursor()

            


class ActionOpenIncident(Action):
    def name(self) -> Text:
        return "action_open_incident"
    
    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict]:
        
        priority = tracker.get_slot("priority")
        email = tracker.get_slot("email")
        problem_description = tracker.get_slot("problem_description")
        incident_title = tracker.get_slot("incident_title")
        confirm = tracker.get_slot("confirm")
        
        
        message = (
                f"An incident with the following details would be opened "
                f"email: {email}\n"
                f"problem description: {problem_description}\n"
                f"title: {incident_title}\npriority: {priority}")
        
        if  confirm:
              query_insert = ("""insert into incident('titolo','descrizione','email', 'priorita') values
                             (? ,?, ?, ?) """)
              
              record = (incident_title, problem_description, email, priority)
              
              cur.execute(query_insert, record)
              
              con.commit()
              
              dispatcher.utter_message(message)
                
              return [AllSlotsReset(), SlotSet("previous_email", email)]
        else:
           dispatcher.utter_message(
                template="utter_incident_creation_canceled"
                )
        
        return [AllSlotsReset(), SlotSet("previous_email", email)]
    
    
    
class ActionCheckIncidentStatus(Action):
    def name(self) -> Text:
        return "action_check_incident_status"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict]:
        """Look up all incidents associated with email address
           and return status of each"""

        email = tracker.get_slot("email")

       
           
        if email:
          
          record = email
          
          cur.execute("select stato from incident where email = ?" , [record])
         
        
          stato = cur.fetchone()[0];
           
          message = (f"Lo stato del vostro ticket è il seguente: {stato}")
               
        else:
                message = ("email non valida")

        dispatcher.utter_message(message)
        return [AllSlotsReset(), SlotSet("previous_email", email)]

    
    



            
