const { User } = require('../models');
const loaders = require('../loaders');

loaders();

const seedUser = async () => {
    const user = new User({
        username: 'admin',
        email: 'admin@admin.com',
        password: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
    });

    await user.save();
    console.log('User created successfully');        
}

seedUser();