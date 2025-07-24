use UserDb;

select * from users;
select * from LoginUsers;


Delete users Where id = '32';

UPDATE LoginUsers SET Role='Admin' where Id=21;


select * from UserRolePermissions;
select * from Roles; 
select * from Permissions;

delete roles where Id=3;
INSERT INTO Roles (name) VALUES ('Admin');
INSERT INTO Roles (name) VALUES ('User');

INSERT INTO Permissions (Name) VALUES ('view_users');
INSERT INTO Permissions (Name) VALUES ('edit_users');

-- Admin gets both permissions
INSERT INTO UserRolePermissions (RolesId, PermissionsId) VALUES (1, 1); -- Admin - view_users
INSERT INTO UserRolePermissions (RolesId, PermissionsId) VALUES (1, 2); -- Admin - edit_users

-- User gets only view permission
INSERT INTO UserRolePermissions (RolesId, PermissionsId) VALUES (2, 1); -- User - view_users

