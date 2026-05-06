let arr=[10,2,5,8,20]

let max=-Infinity;
let secondMax=-Infinity;

for(let i=0;i<arr.length;i++){
    let num=arr[i];

    if(num>max){
        secondMax=max
        max=num
    }
    else if(num>secondMax && num<max){
        secondMax=num
    }
}

console.log("Second largest number is :",secondMax)
