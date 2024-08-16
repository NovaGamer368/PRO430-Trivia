use Time4Trivia;

-- Insert Initial Data
insert into Users  (username, password, email) values ('admin', '$2b$10$FEO.GJNL/DJS4wH5WkMvzOr0.ZoQ3FU3hO5WVdsM0kL3rBBJ3vrQa', 'admin@test.com');
insert into Users (username, password, email) values ('test', '$2b$10$GlNz68MNngzHKC1Vc4FaDu2zRGnFqXvt3Q69ke1OAnJF9Ml1l/jBm', 'test@test.com');
insert into Users (username, password, email) values ('phil', '$2b$10$GlNz68MNngzHKC1Vc4FaDu2zRGnFqXvt3Q69ke1OAnJF9Ml1l/jBm', 'phil@gmail.com');

insert into Roles (Role, RoleDescription) values ('user', 'standard user role');
insert into Roles (Role, RoleDescription) values ('admin', 'site admins');

set @userId = (select UserId from Users where username = 'test');
set @roleId = (select RoleId from Roles where Role = 'user');
insert into UserRoles (UserId, RoleId) values (@userId, @roleId);

set @userId = (select UserId from Users where username = 'phil');
set @roleId = (select RoleId from Roles where Role = 'user');
insert into UserRoles (UserId, RoleId) values (@userId, @roleId);

set @userId = (select UserId from Users where username = 'admin');
set @roleId = (select RoleId from Roles where Role = 'admin');
insert into UserRoles (UserId, RoleId) values (@userId, @roleId);

-- test data
-- select * from users;
-- select * from roles;
-- select * from userroles;

select u.userid, u.username, r.role
from users u 
	left join userroles ur on u.userid = ur.userid
	left join roles r on r.roleid = ur.roleid;