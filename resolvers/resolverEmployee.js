/**
 * @author: Jam Furaque
 */

const { check, validationResult } = require('express-validator');
const Employee = require('../models/employee');
const authMiddleware = require('../middleware/auth');

module.exports = {
  Query: {
    getAllEmployees: authMiddleware(async (_, args, context) => {                           // GET ALL EMPLOYEES FUNCTION
      const validations = [                                                                 // BEFORE GETTING ALL EMPLOYEES,
        check('_id', 'Invalid ID format').optional().isMongoId(),                           // OFCOURSE WE NEED TO VALIDATE THE INPUT FIRST RIGHT?
      ];

      for (let validation of validations) {
        const result = await validation.run({ query: args });
        if (!result.isEmpty()) {
          throw new Error(result.array()[0].msg);
        }
      }

      try {
        const employees = await Employee.find();                                            // AFTER THE VALIDATION, THEN BRO
        return employees;                                                                   // WE CAN PROCEED
      } catch (error) {
        throw new Error('Error retrieving employees: ' + error.message);
      }
    }),

    getEmployeeById: authMiddleware(async (_, { eid }) => {                                 // GET EMPLOYEE BY ID FUNCTION             
      await check('eid', 'Invalid Employee ID').isMongoId().run({ params: { eid } });       // Again, before getting the employee by ID
                                                                                            // Check if ID is valid.,
      const errors = validationResult({ params: { eid } });
      if (!errors.isEmpty()) {
        throw new Error(errors.array()[0].msg);
      }

      try {
        const employee = await Employee.findById(eid);
        if (!employee) {
          throw new Error('Employee not found.');                                       
        }
        return employee;
      } catch (error) {
        throw new Error('Error finding employee: ' + error.message);
      }
    }),

    searchEmployeeBy: authMiddleware(async (_, { input }) => {                                       // SEARCH EMPLOYEE BY FUNCTION           
      try {                                                                                          // Dude, with this function, we can find
        const query = {};                                                                            // eomployee either by department or designation
        if (input.department) {
          await check('department', 'Department cannot be empty').notEmpty().run({ body: input });
          query.department = input.department;
        }
        if (input.designation) {
          await check('designation', 'Designation cannot be empty').notEmpty().run({ body: input });
          query.designation = input.designation;
        }

        const errors = validationResult({ body: input });
        if (!errors.isEmpty()) {
          throw new Error(errors.array()[0].msg);
        }

        if (Object.keys(query).length === 0) {
          throw new Error('Provide department or designation');
        }

        return await Employee.find(query);
      } catch (error) {
        throw new Error('Error searching employees: ' + error.message);
      }
    }),
  },

  Mutation: {
    createEmployee: authMiddleware(async (_, { employeeInput }) => {                // FUNCTION TO CREATE EMPOYEES
      const validations = [                                                         // Before creating an employee, we need to validate inputs
        check('email', 'Invalid email format').isEmail(),                           // Like email,
        check('salary', 'Salary must be at least 1000').isFloat({ min: 1000 }),     // Salary,  
        check('firstName', 'First name is required').notEmpty(),                    // First name, because it should not be empty right?
        check('lastName', 'Last name is required').notEmpty(),                      // Last name, because we dont want our employee to be nameless
        check('designation', 'Designation is required').notEmpty(),                 // Designation, where do you want to put them? Inside fridge?
        check('department', 'Department is required').notEmpty(),                   // Department, because we need to know where they belong
      ];

      for (let validation of validations) {
        const result = await validation.run({ body: employeeInput });
        if (!result.isEmpty()) {
          throw new Error(result.array()[0].msg);
        }
      }

      try {                                                                         // After validation process,
        const { email } = employeeInput;                                            // Check if the employee already exists                   
        const existingEmployee = await Employee.findOne({ email });                 // If the employee already exists, then throw an error
        if (existingEmployee) {
          throw new Error('Employee with this email already exists.');
        }
        const employee = new Employee(employeeInput);                               // If not, then let's summon thy employee LOL
        await employee.save();
        return employee;
      } catch (error) {
        throw new Error('Error creating employee: ' + error.message);
      }
    }),

    updateEmployee: authMiddleware(async (_, { eid, employeeInput }) => {           // FUNCTION TO UPDATE EMPLOYEE
      try {
        const employee = await Employee.findById(eid);                              // Before updating an employee, 
        if (!employee) {                                                            // Ofc, check if they really exist or just a daydream 
          throw new Error('Employee not found.');
        }
        const fieldsToValidate = Object.keys(employeeInput);                        // Then, validate the fields we want to update            
        for (let field of fieldsToValidate) {
          if (field === 'email') {                                                                    // Like email
            await check('email', 'Invalid email format').isEmail().run({ body: employeeInput });
          }
          if (field === 'salary') {                                                                   // and salary                           
            await check('salary', 'Salary must be at least 1000').isFloat({ min: 1000 }).run({ body: employeeInput });
          }
        }

        const errors = validationResult({ body: employeeInput });                   // After validation,
        if (!errors.isEmpty()) {                                                    // If there are errors, then throw an error             
          throw new Error(errors.array()[0].msg);
        }

        Object.keys(employeeInput).forEach((key) => {                               // if there's no errors, dang that's a good sign 
          employee[key] = employeeInput[key];
        });

        employee.updated = new Date();                                              // Update the employee then save it
        await employee.save();
        return employee;
      } catch (error) {
        throw new Error('Error updating employee: ' + error.message);
      }
    }),

    deleteEmployee: authMiddleware(async (_, { eid }) => {                            // FUNCTION TO DELETE EMPLOYEE
      await check('eid', 'Invalid Employee ID').isMongoId().run({ params: { eid } }); // Again, before deleting an employee, make sure the id is valid
      const errors = validationResult({ params: { eid } });                           // If not, then throw an error.
      if (!errors.isEmpty()) {
        throw new Error(errors.array()[0].msg);
      }

      try {
        const employee = await Employee.findByIdAndDelete(eid);                       // If the id is valid, then eliminate that employee!
        if (!employee) {
          throw new Error('Employee not found.');                                     // Oops, we can't find the employee, throw an error then.
        }
        return 'Employee deleted successfully.';                                      // If we got him, throw him out of the bus then lol
      } catch (error) {
        throw new Error('Error deleting employee: ' + error.message);
      }
    }),
  },
};
