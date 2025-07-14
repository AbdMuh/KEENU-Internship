USE UserDb;

Select * from Users;

INSERT INTO Users (Name, Email)
VALUES 
('Ali', 'ali@example.com'),
('Abdullah','abdullah@example.com'),
('Ahmed','ahmed@example.com');

SELECT * FROM LoginUsers;

INSERT INTO LoginUser (Username, Password, Role, UserId)
VALUES 
('ali123', '123', 'User', 1),
('abdullah456', '123', 'Admin', 2),
('ahmed789', '123', 'Manager', 3);


