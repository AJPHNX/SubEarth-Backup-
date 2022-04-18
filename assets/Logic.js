/**************************** 
 *  +Background
 * ------------------------------------
    Backstory:
        -A robot crash lands on earth and has to efficiently make sandwiches to survive
            Why:Efficiency powers its core
    Goal: 
        -Get throughh the lunch rush (sandwich cue) with the best time possible

    Objectives:
        -slice sandwiches with similar components at the same time
        for optimal efficiency 

     Obstacles:
        - You only have space to pre-load 8 sandwiches into your cue 
        - Switching between tasks (i.e. slicing like meats and cheeses) adds to time
        - You cam only fetch 2 loaves of bread per trip
        - Customers can have orders of random length causing you to have to re-ask 
        if it falls out of the temporary cue (for too long?)
            -if re-asked the the 

     Technique:
    
     Restrictions:

     *Additional language:
        'Cue' for sandwiches
        'Line'  for customers
****************************/
document.addEventListener('DOMContentLoaded', function () {
  //let breadToggle =
    function eventElements(element){
        switch(element){
            case 'customer': askCustomer()
            break;
            // case 'breadBasketImg': (element)=>{
            //     element.style.visibility ='hidden'//src="./assets/images/BreadBasketToggle.png"
            // }
            // break;
        }
    }
    document.addEventListener('click',(e)=>{
        element = e.srcElement.id
        console.log(element)
        eventElements(element)
    })
/**************************** 
 *   +Color Declarations
****************************/
    const provColor = '#fcfcfc'
    const turkeyColor = '#f7eee4'
    const hamColor = '#f07878'
    const cappColor = '#f2b4a2'
    const prosColor = '#ff8080'
    const salamColor = '#db8fb1'
    const pepColor = '#d41737'
/**************************** 
 *   +Time Declarations
****************************/
    const sliceInc = 500  //millisec
    const meatSliceTime = sliceInc
    const cheeseSliceTime = sliceInc * 1.1
    const breadSliceTime = sliceInc * 2
    const m_c_SwapTime = sliceInc * 1.5//time it takes to swap a meat or cheese (one way(include ))
    const breadGrabTIme = sliceInc * 1.7//time it takes to grab bread from the rack
//*******Customer Related Factors*******//
    let randCustFrustration = Math.floor(Math.random() * 3)//frustrational slowdown
/**************************** 
 *   +Sandwich Components
****************************/
    const cheese = ['provolone','swiss','american']
    const meat = ['turkey','ham','cappicola','prosciuttini','salami','pepperoni']
/**************************** 
 *  +Sandwich Constructs
****************************/
    const veggie = [cheese[0],cheese[1]]
    const turkey = [cheese[0],meat[0]]
    const ham = [cheese[0],meat[1]]
    const club = [cheese[0],meat[0],meat[1]]
    const slamma = [cheese[0],meat[1],meat[2],meat[3]]
    const italian = [cheese[0],meat[1],meat[2],meat[3],meat[4],meat[5]]
    //const sandwichArray = ['veggie','turkey','ham','club','slamma','italian']
    const sandwichArray = [veggie,turkey,ham,club,slamma,italian]

    let sandwiches =[
        {name:'veggie',
        contents: [cheese[0],cheese[1]]},
        {name:'turkey',
        contents: [cheese[0],meat[0]]},
        {name:'ham',
        contents: [cheese[0],meat[1]]},
        {name:'club',
        contents: [cheese[0],meat[0],meat[1]]},
        {name:'slamma',
        contents: [cheese[0],meat[1],meat[2],meat[3]]},
        {name:'italian',
        contents: [cheese[0],meat[1],meat[2],meat[3],meat[4],meat[5]]}
    ]

    let masterSandwichCue = []//Full cue
    let customerLine = []
    let cueLength = 16
    let cuePosition = 0
    let tempCue = []
    const preLoadMax = 8
    const orderMax = 5
    let workingCue = []
    let outlierNum =0
    let singleNum =0
/**************************** 
 *   +Order Control
****************************/
    function orderControl(randInc,randMax){
        let counter = customerLine.length
        let flip = Math.random()
        flip = flip.toFixed(1)
        console.log(`Flip: ${flip}`)
        if (flip > 0.5){
            if ((counter % randInc)===0){
                controledOrder = Math.floor(Math.random() * randMax)+1//Items in order
                console.log("********Order Control Outier*********")
                outlierNum++
                console.log(`Outlier count:${outlierNum}`)
            }
        }else{
            controledOrder = 1
            console.log("{-----Single Order-----}")
            singleNum++
            console.log(`single count:${singleNum}`)
        } 
        return controledOrder
    }
    
/**************************** 
 *  +Customer Class
****************************/
    class Customer{
        constructor(ease,orderPosition){
            this.itemAmt = orderControl(5,orderMax)//Math.floor(Math.random() * orderMax)+1//Items in order
            this.order = sandwichGenerator(this.itemAmt)
            this.orderDone = true
            this.orderNumber = 0
            this.orderPosition = orderPosition //how far along in slicing order
            this.ease = ease
            this.askTime = (sliceInc * 2) * this.itemAmt   
            this.active = null         
            
        }   
    }
/**************************** 
 *  +Key-listening function
 * ------------------------------------
 *    
****************************/
        window.addEventListener('keydown', logKey);
        function logKey(e) {
            switch(e.key){
                case 'a':
                    /***** Create object full of ask methods *******/
                    askCustomer()
                    
                    /*/Menu options
                            +prepare order
                                +Get bread
                                +Slice bread
                                +Go through cue
                                    +write


                            +ask next customer 
                                +unti working cue is full 
                            
                        /*/

                break;
                case 'm':
                    printMasterCue()
                    console.log(customerLine)
                break;
                case 's':
                    slice(ham)
                break;
                case 'c':
                    // pushToCue()
                break;
                case 'f':
                    fetchSandwichHtml(ham)
                break;
            }
        }
/**************************** 
 *  +Sleep Function
 * ------------------------------------
 *    
****************************/
        function sleep(time){
            return new Promise(resolve => {
                setTimeout(resolve, time)
            })  
        }
/**************************** 
 *  +Generates and returns randomly selected sandwich order
 * ------------------------------------
 *    
****************************/
        function sandwichGenerator(e){
            let sandwichNum = 0
            let order =[]
            for (let i = 0;i<e; i++){
                sandwichNum = Math.floor(Math.random() * 5) 
                order[i] = sandwichArray[sandwichNum]
            }
            return order
        }
/**************************** 
 *  +Ask for customer order
 * ------------------------------------
 *      -takes the randomly generated length of the custoemr order
 *      -Loads to temporary cue (until cues max)
 *          -if order excedes temp cue(...)
 * How: 
 *  on getkey 'a'
 *     
****************************/
        function askCustomer(){
            let newCustomer = new Customer(0,cuePosition) 
            console.log('Customer Asked!')
            if (!newCustomer.orderDone){
                console.log(`Order#: 000${cuePosition}`)
                console.log(newCustomer.order)
                pushToCue(newCustomer.order,masterSandwichCue)
                slice(newCustomer.order)
            }else{
                cuePosition ++
                console.log(`Order#: 000${cuePosition}`)
                console.log(newCustomer.order)
            }
            //newCustomer.order.forEach(e => masterSandwichCue.push)
            //Push each order item to the master cue
            // console.log(
                pushToCue(newCustomer.order,masterSandwichCue)
                // )
            // console.log(`Master Cue Length: ${masterSandwichCue}`)
            //customerLine.push(newCustomer)
        }

        function printMasterCue(){
            console.log(masterSandwichCue)
            console.log(`Single:${singleNum}/Outlier:${outlierNum}`)
        }
        /********************
         *    +Checks if order is completed
         * -------------------------------------
         *      -Returns a Boolean value after taking in Customer.order array and customer.itemAmt
         * **********************/
        function checkIfOrderDone(customerOrder,AmountItems){
           
            // return
        }
/**************************** 
 *  +Fetch Sandwich html info
 * ------------------------------------
 *      -
****************************/  
        async function fetchSandwichHtml(samName){
            var iframe = document.createElement('iframe');
            var html = await fetch(`./WorkingArt/TestSandwich/${samName}.html`);
            iframe.src = await 'data:text/html;charset=utf-8,' + encodeURI(html);
            console.log(html)
        }
/**************************** 
 *  +Appemd Sandwich html/div
 * ------------------------------------
 *      -
****************************/   

/*
const iFrames = document.querySelectorAll(".sandwich-frame")

function addProvolone(){
  iFrames.forEach(frame => {
  if(frame.something.... check for sandwich type) {
    const provImg = document.createElement("img")
    provImg.setAttribute("src", "path-to-img.png")
    frame.append(provImg)
  }
})
}*/
        
        // document.body.appendChild(iframe);
        // console.log('iframe.contentWindow =', iframe.contentWindow);


/**************************** 
 *  +Slice
 * ------------------------------------
 *      -
****************************/
        // function slice(){
        //     console.log(`Slicing!`)
        //     return true
        // 
        document.addEventListener('click',(e)=>{
            element = e.srcElement.id
            console.log(element)
        })
        const provDivs = ['provoloneSlice1','provoloneSlice2','provoloneSlice3']
        const hamDivs = ['hamSlice1','hamSlice2','hamSlice3']
        const turkeyDivs = ['turkeySlice1','turkeySlice2','turkeySlice3']
        const breadTopDiv = ['breadTop']
        // async function sleep(time){
        //     await setTimeout(()=>{},
        //     )
        // }
        
        
        
        async function slice(objs){
            // let currentSlice
            console.log(objs)
            const promises = objs.map(async (slice,index) => {
            // for (i = 0; i < objs.length;i++){
                // setTimeout(()=>{
                    // let id = objs[i]
                    
                    await sleep(750+(index*300))
                    console.log(slice)
                    let currentSlice = document.getElementById(slice)
                    currentSlice.style.visibility ='visible'
                    
                    // console.log(slice)
            })
                await Promise.all(promises)
            }
            // })
            
        
        function breadfinish(){
            let breadTop = document.getElementById('breadTop')
            breadTop.style.visibility ='visible'
        }     

/**************************** 
 *  +Add to tempCue
 * ------------------------------------
 *      -take th
****************************/
        function pushToCue(fromArray,toArray){
            fromArray.forEach(e =>{
                toArray.push(e)
            })
            // console.log(`Add to temp Cue!`)
            return toArray
        }
    console.table(sandwiches)
    
})