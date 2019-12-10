let parentList =[]
let children = []

export  function Init(treeArray, badArray) {
    
    parentList =[]
    children = []
    //拆分树为数组格式
    buildParentList(treeArray)
    findParent(badArray)
    if(badArray){
        children.push(badArray)
    }
    return children;
}

function buildParentList(arr){
	arr.forEach(g =>
	 {
		if(g.PId != undefined) {
			let pid = g['PId']
           	let oid = g['Id']
            parentList[oid] = pid	
		}
		if (g.children != undefined)
            buildParentList(g['children'])
	})
}
function findParent(idx){
    if (parentList[idx] != undefined){
        let pid = parentList[idx]
		children.unshift(pid)
        findParent(pid)
	}
}