print('#################################################################')

print('Start DEV DB Creation');
db = db.getSiblingDB('aument');
db.createCollection('users');
db.createCollection('posts');
db.createCollection('tags');
db.users.insertMany([
    {
        name: 'admin aument',
        email: 'aument@aument.com',
        login: 'aument',
        password: '4e57ec8d8bd6d4e2bc7fccc8',
        createdAt: Date.now(),
        createdBy: 'init seed'

     },
   ]);
print('END DEV DB');

print('Start TEST DB Creation');
db = db.getSiblingDB('aument_test');
db.createCollection('users');
db.createCollection('posts');
db.createCollection('tags');
db.users.insertMany([
    {
        name: 'admin aument',
        email: 'aument@aument.com',
        login: 'aument',
        password: '4e57ec8d8bd6d4e2bc7fccc8',
        createdAt: Date.now(),
        createdBy: 'init seed'

     },
   ]);
print('END TEST DB');

print('#################################################################')
