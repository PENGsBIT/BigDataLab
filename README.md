# build & install

1. install nodejs & npm

2. Clone the code:

        git clone https://github.com/sladezhang/node-red.git
        cd node-red

2. Install the dependencies

        npm install
        npm install -g nodemon   # root priviledge may be required

3. Build the code

        npm run build

4. Run

        npm start   # hot load with nodemon
   or

        node red.js
