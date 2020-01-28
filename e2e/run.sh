#!/usr/bin/env bash 

yarn global add @spedue/create-app

testSuite() {
  create-spedue-app $1-test --template=$1 >$1.log 2>$1-error.log
  CWD=$(pwd)
  cd $1-test
  yarn compile >$1.log 2>$1-error.log
  yarn lint  >$1.log 2>$1error.log
  yarn test --noWatch >$1.log 2>$1-error.log
  yarn build >$1.log 2>$1-error.log
  yarn clean >$1.log 2>$1-error.log
  cd $CWD
}

echo "Testing React Suite"
testSuite react

echo "Testing Gatsby Suite"
testSuite gatsby

echo "Testing NextJS Suite"
testSuite nextjs

echo "Testing Library Suite"
testSuite library
