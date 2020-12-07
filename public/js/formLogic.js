function submitDetails(){
    const name = document.getElementsByName("name")[0].value.trim()
    const prog = document.getElementsByName("prog")[0].value.trim()
    const dept = document.getElementsByName("dept")[0].value.trim()
    const ay = document.getElementsByName("ay")[0].value.trim()
    const sem = document.getElementsByName("sem")[0].value.trim()
    const code = document.getElementsByName("code")[0].value.trim()
    const title = document.getElementsByName("title")[0].value.trim()
    
    if(name.length != 0 && prog.length !=0 && dept.length !=0 && ay.length !=0 && sem.length !=0 && code.length !=0 && title.length !=0 ){
        fetch("/confirmDetails", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "name":name,
                    "prog":prog,
                    "dept":dept,
                    "ay":ay,
                    "sem":sem,
                    "code":code,
                    "title":title
                }) 
        })
        $("#confirmDetails").html("Update Details")
        $("#finalSubmit").css("display", "block")
        return true
    }
    
    else{
        alert("Please fill all the details, and click the Confirm Details/Update Details button")
        return false
    }
}

function submitFinal(){
    if(submitDetails()){
        document.getElementById("fileForm").submit();
    }
    
}