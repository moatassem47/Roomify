const User = require("../model/userSchema");
const bcrypt = require("bcrypt");

const getUserData = async (req, res) => {
    try {
        const id = req.user.id;

        const user = await User.findById(id).select("-password -__v");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (e) {
        console.log(e);
        res.status(500).json({ name: e.name, message: e.message });
    }
}

const changeUserData = async (req, res) => {
    try {
        const id = req.user.id;
        const { firstName, lastName, phone, password, newPassword, address } = req.body;

        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone) user.phone = phone;

       
        if (newPassword) {
            if (!password) {
                return res.status(400).json({ message: "Please provide your current password to set a new one" });
            }

            
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                user.password = await bcrypt.hash(newPassword, 12);
            } else {
                return res.status(400).json({ message: "Wrong current password" });
            }
        }

       
        if (address) {
            user.address = { ...user.address, ...address };
        }

        await user.save();

      
        res.status(200).json({ 
            message: "Data Updated Successfully",
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                address: user.address
            }
        });

    } catch (e) {
        console.log(e);
        if (e.code === 11000) {
            return res.status(400).json({ message: "This phone number or email is already registered to another account" });
        }
        res.status(500).json({ name: e.name, message: e.message });
    }
}

module.exports = { getUserData, changeUserData }