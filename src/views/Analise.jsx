
import React from "react";

class Analise extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            analise: []
        }
    }

    componentDidMount(){

        if(!localStorage.getItem('var_decisao') || !localStorage.getItem('restricao') || !localStorage.getItem('objetivo') || !localStorage.getItem('max_interacoes') || !localStorage.getItem('quadro')){
            this.props.history.push('/variaveis')
        }

        var cabecalho = ['Variável', 'Tipo de variável', 'Valor inicial', 'Valor final', 'Recurso escasso', 'Básica', 'Sobra recurso', 'Uso recurso', 'Preço sombra', 'Custo reduzido', 'Aumentar o parâmetro', 'Reduzir o parâmetro', 'Máximo', 'Mínimo']

        var analise = [cabecalho]

        for(var k = 0; k < parseInt(localStorage.getItem('var_decisao')); k++){
            analise.push([`X${k+1}`, 'Decisão', '0'])
        }
        for(var j = 0; j < parseInt(localStorage.getItem('restricao')); j++){
            analise.push([`F${j+1}`, 'Folga', localStorage.getItem(`b${j+1}`)])
        }

        analise.push(['Z', 'Função objetivo', '0'])

        for(var i = 1; i < analise.length; i++){
            JSON.parse(localStorage.getItem('quadro')).map((linha, index) => {
                if(linha[0] === analise[i][0]){
                    analise[i].push(`${JSON.parse(localStorage.getItem('quadro'))[index][JSON.parse(localStorage.getItem('quadro'))[0].length - 1]}`)
                } 
                return null
            }) 
            if(analise[i].length === 3){
                analise[i].push('0')
            }           
        }

        for(var a = 1; a < analise.length; a++){
            if(analise[a][3] === '0' && analise[a][1] === 'Folga'){
                analise[a].push('Sim')
            }           
            else if(analise[a][1] === 'Folga'){
                analise[a].push('Não')
            } 
            else{
                analise[a].push('-')
            }
        } 

        for(var b = 1; b < analise.length; b++){
            JSON.parse(localStorage.getItem('quadro')).map((linha, index) => {
                if(linha[0] === analise[b][0]){
                    analise[b].push('Sim')
                } 
                return null
            }) 
            if(analise[b].length === 5){
                analise[b].push('Não')
            }           
        }

        for(var c = 1; c < analise.length; c++){
            if(analise[c][1] === 'Folga'){
                analise[c].push(analise[c][3])
            } 
            else{
                analise[c].push('-')
            }
        }

        for(var d = 1; d < analise.length; d++){
            if(analise[d][1] === 'Folga'){
                analise[d].push(`${parseFloat(analise[d][2]) - parseFloat(analise[d][3])}`)
            } 
            else{
                analise[d].push('-')
            }
        }

        for(var e = 1; e < analise.length; e++){
            if(analise[e][1] === 'Folga'){
                for(var f = 1; f < JSON.parse(localStorage.getItem('quadro'))[0].length; f++){
                    if(analise[e][0] === JSON.parse(localStorage.getItem('quadro'))[0][f]){
                        analise[e].push(JSON.parse(localStorage.getItem('quadro'))[JSON.parse(localStorage.getItem('quadro')).length - 1][f])
                    }
                }
            } 
            else{
                analise[e].push('-')
            }
        }

        for(var g = 1; g < analise.length; g++){
            if(analise[g][1] === 'Decisão'){
                for(var h = 1; h < JSON.parse(localStorage.getItem('quadro'))[0].length; h++){
                    if(analise[g][0] === JSON.parse(localStorage.getItem('quadro'))[0][h]){
                        analise[g].push(JSON.parse(localStorage.getItem('quadro'))[JSON.parse(localStorage.getItem('quadro')).length - 1][h])
                    }
                }
            } 
            else{
                analise[g].push('-')
            }
        }

        for(var l = 1; l < analise.length; l++){
            if(analise[l][1] === 'Folga'){
                var aumentar = 100000000000000
                var reduzir = -100000000000000
                for(var m = 1; m < JSON.parse(localStorage.getItem('quadro'))[0].length; m++){
                    if(analise[l][0] === JSON.parse(localStorage.getItem('quadro'))[0][m]){
                        for(var n = 1; n < JSON.parse(localStorage.getItem('quadro')).length - 1; n++){
                            var resultadoDivisao = (parseFloat(JSON.parse(localStorage.getItem('quadro'))[n][JSON.parse(localStorage.getItem('quadro'))[0].length - 1]) / parseFloat(JSON.parse(localStorage.getItem('quadro'))[n][m])) * -1 
                            if(resultadoDivisao.toString() === '-Infinity'){
                                aumentar = 'Infinito'
                            }
                            else{
                                if(resultadoDivisao < 0 && reduzir < resultadoDivisao){
                                    reduzir = resultadoDivisao
                                }
                                if(resultadoDivisao > 0 && aumentar > resultadoDivisao){
                                    aumentar = resultadoDivisao
                                }
                            }
                        }
                    }
                }
                if(aumentar === 'Infinito'){
                    analise[l].push(`${aumentar}`, `${Math.abs(reduzir)}`)
                }
                else{
                    analise[l].push(`${Math.abs(aumentar)}`, `${Math.abs(reduzir)}`)
                }
            } 
            else{
                analise[l].push('-', '-')
            }
        }

        for(var o = 1; o < analise.length; o++){
            if(analise[o][1] === 'Folga'){
                if(analise[o][10] === 'Infinito'){
                    analise[o].push(`Infinito`, `${parseFloat(analise[o][2]) - parseFloat(analise[o][11])}`)
                }
                else{
                    analise[o].push(`${parseFloat(analise[o][2]) + parseFloat(analise[o][10])}`, `${parseFloat(analise[o][2]) - parseFloat(analise[o][11])}`)
                }
            } 
            else{
                analise[o].push('-', '-')
            }
        }

        console.log(analise)
        this.setState({analise: analise})
    }

    carregarAnalise = (record, i) => {
        return (
            <tr key={i}>
                {record.map(this.carregarAnaliseTD)}
            </tr>
        )
    }

    carregarAnaliseTD = (record, i) => {
        return (<td key={i} style={{padding: '1vw'}}>{record}</td>)
    }

    render() {
        return (
            <>
                <h2>Análise de sensibilidade</h2>
                <table style={{border: '1px solid black', overflowX: 'auto'}}>
                    <tbody>
                        {this.state.analise.map(this.carregarAnalise)}
                    </tbody>
                </table>
            </>
        );
    }
}

export default Analise;
