# BsSharedUtils

Collection of services, components, pipes, factory classes and helper function usefull in common applications.

## Services

### ServiceBase
This is the base class that all server you will develop must to implements.
It handle configuration files reading and common settings for all services like authentication facilities.
This service exposes some usefull methods and properties:

#### T(string, Object|undefined = undefined):string
This method translate the string code passed as parameter using NgxTranslate Module.

#### apiUrl():string
This property return the api endpoint url (it reads the value from configuration file) with the '/' suffix (if user doesnt type it in the config file value).

### ApplicationService
It handles all the base settings for any custom service. You dont need to directly inject this service in your custom service but 
simply implement your service deriving from ServiceBase.

### ErrorService
Usefull to handle errors. 

#### goToBrokenPage
This route to the Broken Page Component (like 500 errror)

#### handleError
This handle the error object you provide as parameter. It can handle 'HttpResponseError', 'EventError' and other generic error.
It writes the debug log on browser and return, in case of 'HttpResponseError' the status code.

### ModalMessageService
It manages modal message for information, warning and error messages. It owns a method to show and get response (subscription) of a modal confirm message.

## Factory functions

### appConfigFactory
Used as APP_INITIALIZER provider to load application configuration file before bootstrap application.

### dtConfigFactory
Used as APP_INITIALIZER provider to load data tables configuration file before bootstrap application.

### HttpLoaderFactory
Factory used bu translate service to confgure custo translate loader.

## Date and time functions

### getSecondsToDate 
Return the seconds (number) to a provided date. If date is undefined it returns the second to current date and time.
