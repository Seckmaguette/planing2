//Les donnees de l'application
const modules = [
    { id: 1, nom : 'JavaScript', semaine: '', planning: [[],[],[],[],[],[]]},
    { id: 2, nom : 'Python', semaine: '', planning: [[],[],[],[],[],[]]},
    { id: 3, nom : 'Java', semaine: '', planning: [[],[],[],[],[],[]]},
    { id: 4, nom : 'PHP', semaine: '', planning: [[],[],[],[],[],[]]},
    { id: 5, nom : 'C Sharp', semaine: '', planning: [[],[],[],[],[],[]]},
];
//
const classes = [
    { id: 1, nom: 'L3 GL', effectif: 23, semaine:'', planning: [] },
    { id: 2, nom: 'L2 GL', effectif: 23, semaine:'', planning: [] },
    { id: 3, nom: 'L3 Multimedia', effectif: 23, semaine:'', planning: [] },
    { id: 4, nom: 'L3 Dev Web', effectif: 23, semaine:'', planning: [] },
    { id: 5, nom: 'L1 Communication', effectif: 23, semaine:'', planning: [] },
];
//
const salles = [
    { id: 1, nom : '101', nbrPlaces: 29, semaine: '', planning: [[],[],[],[],[],[]]},
    { id: 2, nom : '102', nbrPlaces: 50, semaine: '', planning: [[],[],[],[],[],[]]},
    { id: 3, nom : '201', nbrPlaces: 20, semaine: '', planning: [[],[],[],[],[],[]]},
    { id: 4, nom : '201', nbrPlaces: 60, semaine: '', planning: [[],[],[],[],[],[]]},
];
//
const enseignants = [
    { id:1, nom: 'Aly NIANG', semaine:'', planning:[[],[],[],[],[],[]], modules:[1,2,4] },
    { id:2, nom: 'WANE', semaine:'', planning:[[],[],[],[],[],[]], modules:[1,2,3,4] },
    { id:3, nom: 'NIASS', semaine:'', planning:[[],[],[],[],[],[]], modules:[1,4] },
    { id:4, nom: 'MBAYE', semaine:'', planning:[[],[],[],[],[],[]], modules:[5] },
    { id:5, nom: 'NDOYE', semaine:'', planning:[[],[],[],[],[],[]], modules:[3,4] },
];

//
const classe = {
    nom : 'L3 GL',
    semaine : '13/02/2023 - 17/02/2023',
    effectif: 34,
    planning: [
        [
            // {module: 'Python', prof: 'Aly NIANG', duree: 3, debut: 9, salle:'201'},
            // {module: 'PHP', prof: 'Wane', duree: 4, debut: 13, salle:'101'},
        ],[],[],[],[],
        [
            // {module: 'Java', prof: 'NIASS', duree: 4, debut: 12, salle:'info'}
        ]
    ]
};
//
const colors = ['#da974b','#E8B01F','#DBCB89','#71BCF3','#E0474C','#7FB8B4','#B2B1B1','#9F4C9D','#0073BC'];
const cards = document.querySelectorAll('.card');
const select = document.querySelector("#select");

const divClasses = document.querySelector('#classes');
const divEnseignants = document.querySelector('#enseignants');
const divSalles = document.querySelector('#salles');

const addCours = document.querySelectorAll('.add-cours');
const selectModule = document.querySelector('#select_module');
const selectEnseignant = document.querySelector('#select_enseignant');
const selectDebut = document.querySelector('#select_debut');
const selectFin = document.querySelector('#select_fin');
const selectSalle = document.querySelector('#select_salle');
const errorModal = document.querySelector('.error-modal');
const btnSaveModal = document.querySelector('#save');
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('#closeModal');
let jour = 0;

chargerHeure(8,17,selectDebut);
chargerHeure(9,18,selectFin);
chargerSelect(modules,selectModule,'Choisir un Module');
// chargerSelect(enseignants,selectEnseignant,'Choisir un Enseignant');
chargerSelect(salles,selectSalle,'Choisir une Salle');
// window.onload = printPlanning;
printPlanning();


//EVENTS
addCours.forEach(btn => {
    btn.addEventListener('click',(e)=>{
        //Recuperer le btnPlus
        jour = e.target.getAttribute('day') - 1;
        //Ovrir le modal
        modal.classList.toggle('open');
    })
});
//
closeModal.addEventListener('click',()=>{
    modal.classList.toggle('open');
});
//
selectModule.addEventListener('change',()=>{
    const idModule = getSelectedValue(selectModule);
    const profs = getProfdByIdModule(idModule);
    chargerSelect(profs,selectEnseignant,'Choisir un Enseignant');
});
//
btnSaveModal.addEventListener('click',()=>{
    const idModule = getSelectedValue(selectModule);
    const idProf = getSelectedValue(selectEnseignant);
    const idSalle = getSelectedValue(selectSalle);
    const heureDebut = +getSelectedValue(selectDebut);
    const heureFin = +getSelectedValue(selectFin);

    //Faire de test de validite

    //Ajouter le cours a la classe:
    classe.planning[jour].push({
        module: getNameById(idModule,modules), 
        prof: getNameById(idProf,enseignants), 
        duree: heureFin-heureDebut, 
        debut: heureDebut, 
        salle: getNameById(idSalle,salles)
    });
    printPlanning();
    modal.classList.toggle('open');
});

//FUNCTIONS

function getNameById(id,datas){
    const d = datas.find(d=>d.id == id);
    return d.nom;
}
function getProfdByIdModule(idModule){
    // const profsFound = [];
    // enseignants.forEach(e => {
    //     e.modules.forEach(idM => {
    //         if(idM == idModule){
    //             profsFound.push(e);
    //         }
    //     });
    // });
    // return profsFound;
    return enseignants.filter(e=>e.modules.includes(+idModule));
}
//
function getSelectedValue(select){
    return select.options[select.selectedIndex].value;
}
//
function printPlanning(){//Afficher le planning de la classe
    //effacer tous les cours du planning actuel
    cleanCours();
    //Parcourir les cours de la classe actuelle et afficher les donnees
    classe.planning.forEach((p,i) => {
        const jour = document.querySelector(`#day_${i + 1}`);
        //Parcourir les cours du jour
        p.forEach(c => {
            let posColor = Math.floor(Math.random() * colors.length);
            jour.appendChild(createDivCours(c.debut,c.duree,colors[posColor],c.module,c.prof,c.salle));
        });
    });
}

function createDivCours(debut, duree, color, module, prof, salle){
    col = debut - 8;

    const div = document.createElement('div'); //<div></div>
    div.className = 'cours';

    const spanDelete = document.createElement('span');
    spanDelete.innerText = 'x';
    spanDelete.className = 'delete-cours';

    const small1 = document.createElement('small');
    small1.innerText = prof;

    const small2 = document.createElement('small');
    small2.innerText = salle;

    const h3 = document.createElement('h3');
    h3.innerText = module;

    div.style.backgroundColor = color;
    div.style.width = `${ duree * 10 }%`;
    div.style.marginLeft = `${ col * 10 }%`

    div.append(spanDelete,small1,h3,small2);
    return div;    
}

function cleanCours(){
    const coursContents = document.querySelectorAll('.day-content');
    coursContents.forEach(cours => {
        cours.innerHTML = ''
    });
}

function chargerSelect(data,select,label){
    select.innerHTML = '';
    //
    const option = document.createElement('option');
    option.innerText = label;
    option.value = '0';
    select.appendChild(option);
    //
    data.forEach(d => {
        const option = document.createElement('option');
        option.innerText = d.nom;
        option.value = d.id;
        select.appendChild(option);
    });
}

function chargerHeure(min, max, select){
    select.innerHTML = '';
    const option = document.createElement('option');
    option.innerText = 'Choisir une Heure';
    option.value = '0';
    select.appendChild(option);
    for (let i = min; i <= max; i++) {
        const option = document.createElement('option');
        option.innerText = `${i} H`
        option.value = i;
        select.appendChild(option);
    }
}
