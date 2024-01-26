const Employee = require("../model/employeeModel");
const addEmployee = async (req, res) => {
    try {
        const {
            f_name,
            l_name,
            R_name,
            B_name,
            email,
            gender,
            DOB,
            nId,
            designation,
            mobile,
            commentNotes,
            profilePicture,
            streetNo,
            city,
            stateProvince,
            postalCode,
            country,
            emergencyAddress,
            emergencyEmail,
            emergencyName,
            emergencyNumber,
            emergencyRelation
        } = req.body;

        if (!f_name || !l_name || !email) {
            return res.status(400).json({ msg: "Please fill all required fields" });
        } else {
            let employeeExist = await Employee.findOne({ email });
            if (employeeExist) {
                return res.status(409).json({ msg: `${email} already exists` });
            } else {
                const newEmployee = new Employee({
                    f_name,
                    l_name,
                    R_name,
                    B_name,
                    email,
                    gender,
                    DOB,
                    nId,
                    designation,
                    mobile,
                    commentNotes,
                    profilePicture,
                    streetNo,
                    city,
                    stateProvince,
                    postalCode,
                    country,
                    emergencyAddress,
                    emergencyEmail,
                    emergencyName,
                    emergencyNumber,
                    emergencyRelation
                });

                const result = await newEmployee.save();
                res.status(201).json(result);
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const employee = await Employee.findById(employeeId);
        
        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }

        res.status(200).json(employee);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

const updateEmployeeById = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const dataToUpdate = req.body;

        const employee = await Employee.findByIdAndUpdate(
            employeeId,
            { $set: dataToUpdate },
            { new: true }
        );

        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }

        res.status(200).json(employee);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

const deleteEmployeeById = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const employee = await Employee.findByIdAndDelete(employeeId);

        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }

        res.status(200).json({ msg: 'Employee deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

module.exports = {
    addEmployee,
    getEmployeeById,
    updateEmployeeById,
    deleteEmployeeById
};
