rm -rf client/build
brownie run scripts/script_factory.py --network $1
cp -r build/ client/build/
