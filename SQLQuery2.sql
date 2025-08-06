use UserDb;

select * from LoginUsers;
INSERT INTO Bills (challanNumber, amount, dueDate, Description, status, UserId)
VALUES 
  ('CHLN001', 120.50, '2025-09-15', 'Electricity bill for September', 'Pending', 33),
  ('CHLN002', 75.00, '2025-09-10', 'Water bill for September', 'Paid', 34),
  ('CHLN003', 220.00, '2025-09-20', 'Internet charges for August', 'Pending', 35),
  ('CHLN004', 340.75, '2025-08-30', 'House rent for August', 'Paid', 33),
  ('CHLN005', 89.99, '2025-09-12', 'Mobile recharge', 'Pending', 34),
  ('CHLN006', 49.50, '2025-09-08', 'Gas bill', 'Paid', 35),
  ('CHLN007', 150.00, '2025-09-18', 'Maintenance charges', 'Pending', 33),
  ('CHLN008', 300.00, '2025-09-25', 'Security services', 'Pending', 34),
  ('CHLN009', 110.00, '2025-09-05', 'Internet bill for September', 'Paid', 35),
  ('CHLN010', 200.00, '2025-09-15', 'Generator fuel charges', 'Pending', 35);
