const macroColors = {
    fat: '#EDF561',
    fatFont: '#EDF561',
    protein: '#3CAB65',
    proteinFont: '#3CAB65',
    carbs: '#2588AB',
    carbsFontColor: '#90CCF4',
    calories: '#F5F5DC'
} 

const colors = {
    one: '#05386B',
    two: '#EDF5E1',
    three: '#8EE4AF',
    four: '#379683',
    five: '#5CCB85',
    listIcon: '#EDF5E1'  
}

const colorsSecondary = {
    one: '#AFD275',
    two: '#C2B9B0',
    three: '#C2CAD0',
    four: '#7E685A',
    five: '#E7717D',
};

export default globalStyles = {
    colors,
    color: '#000',
    backgroundColor: colors.three,
    // Because of pie chart, must use only colors by #XXXXXX
    proteinColor: macroColors.protein,
    carbColor: macroColors.carbs,
    fatColor: macroColors.fat,
    fatFontColor: macroColors.fatFont,
    caloriesColor: macroColors.calories,
    carbsFontColor: macroColors.carbsFontColor,
    buttonColor: colors.five,
    buttonTextColor: '#333',
    fontColor: '#fff',
    placeHolderTextColor: '#ccc',
    iconColor: colors.two,
    //
    menuColor: {
        macros: colors.five,
        workouts: colorsSecondary.five
    },
}