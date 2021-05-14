# go-rest
RikData REST Builder is a Golang based application that uses dynamic entity definitions to map existing tables to map objects. As entities are created dynamically, you can configure all the objects as per your business requirement.

Ex: If your custom legacy application has 1000s of tables, but you want to expose only a few hundred tables and some columns of those tables using REST APIs, you can configure the REST builder to expose only those tables and fields. It also allows you to control Primary Fields, Required Fields, Insert Ony/Update Only Fields, OneToMany, ManyToOne mapping, etc.

# RikData OneApp
OneApp is a mobile/desktop application for creating, viewing, and updating various business-related documents and transactions in a single user interface. The default configuration of OneApp supports different business systems such as Oracle Cloud Applications, SAP HANA S/4, Oracle E-Business Suite R12, Microsoft Dynamics 365 Business Central, Microsoft Dynamics 365 for Finance and Operations, ServiceNow, etc. You can also use the OneApp with any other ERP, PLM, Quality, MES business system that provides REST/ODATA APIs similar to any seeded applications.

The user interface is also available in Windows & macOS to configure various business processes and create navigation menus, forms, queries, reports, and charts.


## How to use
Download the application (including SQLite database @ https://github.com/rikdata/goRrest/tree/main/windows/assets/db ). 

Unzip all the files.
Change your EBS Database details in the config.json file.

Start the server. 

Update the EBS_PROD instance of your client application (Desktop/Mobile).

Log in to the application using the default username and password: admin/admin.

Read the documentation @ http://docs.rikdata.com and JavaDocs @ https://docs.rikdata.com/docs/javadocs/

