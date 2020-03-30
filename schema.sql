DROP DATABASE zookeeper;
CREATE DATABASE zookeeper;
USE zookeeper;

CREATE TABLE Staff (
		ID INTEGER PRIMARY KEY auto_increment,
		Name CHAR(255)
);
CREATE TABLE Cage (
	ID INT PRIMARY KEY auto_increment,
	Size INTEGER ,
	Location CHAR(255)
);

CREATE TABLE Animal (
	ID INT Primary Key auto_increment,
	Cage_ID INTEGER,
	Vet_ID INTEGER,
	Zookeeper_ID INTEGER,
	Species CHAR(255),
	Gender CHAR(1),
	Name CHAR(255),
	Age INTEGER,
	CONSTRAINT fk_vet FOREIGN KEY (Vet_ID) REFERENCES Staff(ID)
	ON UPDATE CASCADE
	ON DELETE CASCADE,
    CONSTRAINT fk_zookeeper FOREIGN KEY (Zookeeper_ID) REFERENCES Staff(ID)
	ON UPDATE CASCADE
	ON DELETE CASCADE,
	CONSTRAINT fk_cage FOREIGN KEY (Cage_ID) REFERENCES Cage(ID)
	ON UPDATE CASCADE
	ON DELETE CASCADE
);


CREATE TABLE Animal_Meal (
	Animal_ID INT,
	ID INT,
	Amount INT,
	Time DATETIME DEFAULT NOW(),
	Zookeeper_ID INTEGER, 
	Type CHAR(255),
	PRIMARY KEY (Animal_ID, ID),
	CONSTRAINT fk_feedee FOREIGN KEY (Animal_ID) REFERENCES Animal(ID)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
	CONSTRAINT fk_feeder FOREIGN KEY (Zookeeper_ID) REFERENCES Staff(ID)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

CREATE TABLE Guest (
	Entry_Number INT PRIMARY KEY auto_increment,
	Age INT,
	Payment_Method varchar(100)
);

CREATE TABLE Shows (
	show_name CHAR(255),
	show_time DATETIME DEFAULT NOW(),
	PRIMARY KEY (show_name, show_time)
);

CREATE TABLE Performs (
	Show_Name CHAR(255),
	Show_Time DATETIME,
	Staff_ID INTEGER ,
	Animal_ID INT,
	PRIMARY KEY (Show_Name, Show_Time, Staff_ID, Animal_ID),
	CONSTRAINT FK_show FOREIGN KEY (Show_Name, Show_Time) REFERENCES Shows(show_name, show_time)
	ON DELETE CASCADE
	ON UPDATE CASCADE ,
	CONSTRAINT FK_perfomingStaff FOREIGN KEY (Staff_ID) REFERENCES Staff(ID)
	ON DELETE CASCADE
	ON UPDATE CASCADE ,
	CONSTRAINT FK_performingAnimal FOREIGN KEY (Animal_ID) REFERENCES Animal(ID)
	ON DELETE CASCADE
	ON UPDATE CASCADE 
);

CREATE TABLE Charity (
	charity_name CHAR(255) PRIMARY KEY
);


CREATE TABLE Donates (
	Guest_Entry_Number INTEGER, 
	Charity_Name CHAR(255),
	Amount INTEGER ,
	PRIMARY KEY (Guest_Entry_Number, Charity_Name),
	CONSTRAINT FK_donator FOREIGN KEY (Guest_Entry_Number) REFERENCES Guest(Entry_Number),
	CONSTRAINT FK_donatee FOREIGN KEY (Charity_Name) REFERENCES Charity(charity_name)
);

CREATE TABLE Shop (
	Location CHAR(255),
	Name CHAR(255),
	Hours INTEGER,
	PRIMARY KEY(Location, Name)
);

CREATE TABLE Product (
	Product_ID INTEGER PRIMARY KEY AUTO_INCREMENT,
	Product_name CHAR(255)
);

CREATE TABLE Ticket_Price (
	Age_Range VARCHAR(20) PRIMARY KEY,
	Current_Rate INTEGER NOT NULL
);

CREATE TABLE Ticket (
	Product_ID INTEGER,
	Age_Range varchar(20),
	Number INTEGER,
	Current_Rate INTEGER,
	PRIMARY KEY(Product_ID, Number),
	CONSTRAINT FK_ticketId FOREIGN KEY(Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_price FOREIGN KEY(Age_Range) REFERENCES Ticket_Price(Age_Range) ON DELETE CASCADE ON UPDATE CASCADE
);



CREATE TABLE Gift_Shop_Item (
	Product_ID INTEGER,
	ID INTEGER,
	Name CHAR(255),
	Price INTEGER,
	PRIMARY KEY(Product_ID, ID),
	CONSTRAINT FK_giftId FOREIGN KEY(Product_ID) REFERENCES Product(Product_ID)
);


CREATE TABLE Buys (
	Purchase_Number INTEGER PRIMARY KEY AUTO_INCREMENT,
	Guest_Entry_Number INTEGER NOT NULL,
	Product_ID INTEGER NOT NULL,
	Time DATETIME DEFAULT NOW(),
	Payment_Method varchar(100),
	CONSTRAINT FK_buyee FOREIGN KEY(Product_ID) REFERENCES Product(Product_ID),
	CONSTRAINT FK_buyer FOREIGN KEY(Guest_Entry_Number) REFERENCES Guest(Entry_Number)
);


CREATE TABLE Works_At (
	Sales_Person_ID INTEGER,
	Location CHAR(255),
	Name CHAR(255),
	PRIMARY KEY (Sales_Person_ID, Location, Name),
	CONSTRAINT FK_worker FOREIGN KEY (Sales_Person_ID) REFERENCES Staff(ID)
	ON UPDATE CASCADE
	ON DELETE CASCADE,
	CONSTRAINT FK_workplace FOREIGN KEY(Location, Name) REFERENCES Shop(Location, Name)
	ON UPDATE CASCADE
	ON DELETE CASCADE
);

CREATE TABLE Watches (
	Guest_ID INTEGER,
	Show_Name CHAR(255),
	Date_Time DATETIME DEFAULT NOW(),
	PRIMARY KEY(Guest_ID, Show_Name, Date_Time),
	CONSTRAINT FK_watcher FOREIGN KEY(Guest_ID) REFERENCES Guest(Entry_Number)
	ON UPDATE CASCADE
	ON DELETE CASCADE,
	CONSTRAINT FK_showToWatch FOREIGN KEY(Show_Name, Date_Time) REFERENCES Shows(show_name, show_time)
	ON UPDATE CASCADE
	ON DELETE CASCADE
);

CREATE TABLE Cleans (
	Zookeeper_ID INTEGER,
	Cage_ID  INT NOT NULL,
	Date_Time DATETIME DEFAULT NOW(),
	PRIMARY KEY(Zookeeper_ID, Cage_ID),
	CONSTRAINT FK_cleaningStaff FOREIGN KEY(Zookeeper_ID) REFERENCES Staff(ID)
	ON UPDATE CASCADE
	ON DELETE CASCADE,
	CONSTRAINT FK_cageToBeCleaned FOREIGN KEY(Cage_ID) REFERENCES Cage(ID)
	ON UPDATE CASCADE
	ON DELETE CASCADE
);

CREATE TABLE Item_Availability (
	Location CHAR(255),
	Name  CHAR(255),
	Product_ID INTEGER,
	PRIMARY KEY(Location, Name, Product_ID),
	CONSTRAINT FK_itemID FOREIGN KEY(Product_ID) REFERENCES Product(Product_ID)
	ON UPDATE CASCADE
	ON DELETE CASCADE,
	CONSTRAINT FK_shopLocation FOREIGN KEY(Location, Name) REFERENCES Shop(Location,Name)
	ON UPDATE CASCADE
	ON DELETE CASCADE
);

CREATE TABLE Trains (
	Zookeeper_ID INTEGER,
	Animal_ID  CHAR(255),
	PRIMARY KEY (Zookeeper_ID, Animal_ID),
	CONSTRAINT FK_trainer FOREIGN KEY(Zookeeper_ID) REFERENCES Staff(ID)
	ON UPDATE CASCADE
	ON DELETE CASCADE,
	CONSTRAINT FK_trainee FOREIGN KEY(Animal_ID) REFERENCES Animal(ID)
	ON UPDATE CASCADE
	ON DELETE CASCADE
);