mkdir ./build/src
mkdir ./build/node_modules

pwd=`pwd`

cd build

ln -s ${pwd}/node_modules/* node_modules/
ln -s ${pwd}/src/* src/
