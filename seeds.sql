-- Insert initial data into `department` table
INSERT INTO department (name) VALUES ('Human Resources'), ('Sales'), ('Marketing'), ('Engineering');

-- Insert initial data into `role` table

INSERT INTO role (title, salary, department_id) VALUES 
('HR Manager', 65000.00, 1),
('Sales Representative', 50000.00, 2),
('Marketing Coordinator', 54000.00, 3),
('Software Engineer', 72000.00, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('Jane', 'Doe', 1, NULL),
('John', 'Smith', 2, 1),
('Alex', 'Johnson', 3, 1),
('Emily', 'Davis', 4, NULL);
