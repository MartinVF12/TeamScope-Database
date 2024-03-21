-- Create a new database named employee_tracker_db
CREATE DATABASE employee_tracker_db;
-- Select the employee_tracker_db as the database to use
USE employee_tracker_db;

-- Create a new table named 'department'
-- This table stores information about each department in the company
CREATE TABLE department (
  id INT AUTO_INCREMENT PRIMARY KEY, -- A unique identifier for each department, automatically incremented
  name VARCHAR(30) NOT NULL -- The name of the department, must be provided (cannot be NULL)
);
 
-- Create a new table named 'role'
-- This table stores roles or job titles within the company, including the department they belong to and their salary
CREATE TABLE role (
  id INT AUTO_INCREMENT PRIMARY KEY, -- A unique identifier for each role, automatically incremented
  title VARCHAR(30) NOT NULL, -- The job title, must be provided (cannot be NULL)
  salary DECIMAL NOT NULL, -- The salary for the role, must be provided (cannot be NULL)
  department_id INT, -- The identifier of the department this role belongs to
  FOREIGN KEY (department_id) REFERENCES department(id) -- A foreign key linking to the 'department' table's 'id' column
);


-- Create a new table named 'employee'
-- This table stores information about each employee, including their role and manager
CREATE TABLE employee (
  id INT AUTO_INCREMENT PRIMARY KEY, -- A unique identifier for each employee, automatically incremented
  first_name VARCHAR(30) NOT NULL, -- The first name of the employee, must be provided (cannot be NULL)
  last_name VARCHAR(30) NOT NULL, -- The last name of the employee, must be provided (cannot be NULL)
  role_id INT, -- The identifier of the role this employee holds
  manager_id INT NULL, -- The identifier of this employee's manager. It can be NULL if the employee has no manager
  FOREIGN KEY (role_id) REFERENCES role(id), -- A foreign key linking to the 'role' table's 'id' column
  FOREIGN KEY (manager_id) REFERENCES employee(id) -- A foreign key linking to the 'employee' table's 'id' column to identify the manager
);
