
-- create database coffee_shop;

create Table bank (
  BankID integer primary key,
  BankName varchar(30)
);

create Table users (
  UID integer primary key,
  name varchar(127),
  password varchar(127),
  phone varchar(14),
  email varchar(255),
  bankid integer,
  bankno varchar(12),
  point integer,
  isBlock bool,
  foreign key (bankid) references bank(bankid) 
);

create Table Voucher (
  VID integer primary key,
  release_date date,
  exp_date date,
  points integer,
  discount decimal
);

create Table Pocket (
  UID integer,
  VID integer,
  amount integer,
  primary key(UID, VID),
  foreign key (UID) references users(UID),
  foreign key (VID) references Voucher(VID)
);

create Table Staff (
  UID integer primary key,
  role char,
  foreign key (UID) references users(UID)
);

create Table Product (
  PID integer primary key,
  name varchar(127),
  price integer,
  img_src varchar(255),
  description varchar(255)
);

create Table Review (
  UID integer,
  PID integer,
  review varchar(255),
  rating int,
  primary key(UID, PID),
  foreign key (UID) references users(UID),
  foreign key (PID) references Product(PID)
);

create Table Order_History (
  status varchar(50),
  HID integer primary key,
  UID integer,
  date_time time,
  total integer,
  payment_method varchar(50),
  Address varchar(255),
  foreign key (UID) references users(UID)
);

create Table Orders (
  HID integer,
  PID integer,
  size char,
  amount integer,
  primary key (HID, PID, size),
  foreign key (HID) references Order_History(HID),
  foreign key (PID) references Product(PID)
);

create Table Applicable (
  PID integer,
  VID integer,
  primary key (PID, VID),
  foreign key (PID) references Product(PID),
  foreign key (VID) references Voucher(VID)
);