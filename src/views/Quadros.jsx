
import React from "react";

class Quadros extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            quadro: [],
            concluir: false,
            resposta: [], 
            interacoes: 0
        }
    }

    componentDidMount(){

        if(!localStorage.getItem('var_decisao') || !localStorage.getItem('restricao') || !localStorage.getItem('objetivo') || !localStorage.getItem('max_interacoes')){
            this.props.history.push('/variaveis')
        }

        var quadro = []
        var cabecalho = ['BASE']

        for(var k = 0; k < parseInt(localStorage.getItem('var_decisao')); k++){
            cabecalho.push(`X${k+1}`)
        }
        for(var j = 0; j < parseInt(localStorage.getItem('restricao')); j++){
            cabecalho.push(`F${j+1}`)
        }

        cabecalho.push('B')
        
        quadro.push(cabecalho)

        for(var b = 0; b < parseInt(localStorage.getItem('restricao')); b++){
            quadro.push([`F${b+1}`])
        }

        quadro.push(['Z'])

        for(var i = 0; i < parseInt(localStorage.getItem('restricao')); i++){
            for(var n = 0; n < parseInt(localStorage.getItem('var_decisao')); n++){
                quadro[i+1].push(parseFloat(localStorage.getItem(`x${n+1}${i+1}`)))
            }
        }

        for(var o = 0; o < parseInt(localStorage.getItem('restricao')); o++){
            for(var p = 0; p < parseInt(localStorage.getItem('restricao')); p++){
                if(o === p){
                    quadro[o+1].push(1)
                }
                else{
                    quadro[o+1].push(0)
                }
            }
        }

        for(var u = 0; u < parseInt(localStorage.getItem('restricao')); u++){
            quadro[u+1].push(parseFloat(localStorage.getItem(`b${u+1}`)))      
        }

        for(var v = 0; v < parseInt(localStorage.getItem('var_decisao')); v++){
            if(localStorage.getItem('objetivo') === 'max'){
                quadro[parseInt(localStorage.getItem('restricao')) + 1].push(parseFloat(localStorage.getItem(`x${v+1}`))*-1)   
            }
            else{
                quadro[parseInt(localStorage.getItem('restricao')) + 1].push(parseFloat(localStorage.getItem(`x${v+1}`)))   
            }   
        }

        for(var z = 0; z < parseInt(localStorage.getItem('restricao')) + 1; z++){
            quadro[parseInt(localStorage.getItem('restricao')) + 1].push(0)      
        }

        this.setState({quadro: quadro})

        if(localStorage.getItem('exibir') === 'resultado'){
            new Promise(resolve => setTimeout(resolve, 0)).then(() => {
                this.executarSimplex()
            })
        }
    }

    carregarQuadro = (record, i) => {
        return (
            <tr key={i}>
                {record.map(this.carregarQuadroTD)}
            </tr>
        )
    }

    carregarQuadroTD = (record, i) => {
        return (<td key={i} style={{padding: '1vw'}}>{record}</td>)
    }

    entraBase = () => {
        var menor = this.state.quadro[parseInt(localStorage.getItem('restricao')) + 1][1]
        var indice = 1
        this.state.quadro[parseInt(localStorage.getItem('restricao')) + 1].map((valor, index) => {
            if(index > 0){
                if(valor < menor && valor < 0){
                    menor = valor
                    indice = index
                }
            }
            return null
        })

        return indice
    }

    sairBase = (indiceEntrar) => {
        var menor = this.state.quadro[1][this.state.quadro[0].length - 1] / this.state.quadro[1][indiceEntrar] 
        var indice = 1
        this.state.quadro.map((linha, index) => {
            if(index > 0 && index <= parseInt(localStorage.getItem('restricao'))){
                if((linha[this.state.quadro[0].length - 1] / linha[indiceEntrar]) < menor && (linha[this.state.quadro[0].length - 1] / linha[indiceEntrar]) > 0){
                    menor = (linha[this.state.quadro[0].length - 1] / linha[indiceEntrar])
                    indice = index
                }
            }
            return null
        })

        return indice
    }

    substituirLinhaPivo = (entrar, sair) => {
        var quadro = this.state.quadro
        var linha = quadro[sair]
        quadro[sair] = [this.state.quadro[0][entrar]]

        for(var a = 1; a < quadro[0].length; a++){
            quadro[sair][a] = linha[a] / linha[entrar]
        }

        this.setState({quadro: quadro})
    }

    novoQuadro = (entrar, sair) => {
        var linhas = []
        
        for(var b = 1; b <= parseInt(localStorage.getItem('restricao')) + 1; b++){
            var linha = [this.state.quadro[b][0]]
            for(var a = 1; a < this.state.quadro[0].length; a++){
                if(b !== sair){
                    linha.push(this.state.quadro[sair][a] * (this.state.quadro[b][entrar] * -1) + this.state.quadro[b][a])          
                }
                else{
                    linha.push(this.state.quadro[sair][a])
                }
            }
            linhas.push(linha)
        }

        var quadro = this.state.quadro
        for(var c = 0; c < linhas.length; c++){
            quadro[c+1] = linhas[c]
        }

        this.setState({quadro: quadro, interacoes: this.state.interacoes + 1})
    }

    verificarParada = () => {
        var continuar = false
        this.state.quadro[parseInt(localStorage.getItem('restricao')) + 1].map((valor, index) => {
            if(valor < 0){
                continuar = true
            }
            return null
        })
        return continuar
    }

    montarResposta = () => {
        var resposta = []
        for(var i = 1; i < this.state.quadro.length - 1; i++){
            resposta.push({variavel: this.state.quadro[i][0], resposta: this.state.quadro[i][this.state.quadro[0].length - 1]})
        }
        if(localStorage.getItem('objetivo') === 'max'){
            resposta.push({variavel: this.state.quadro[i][0], resposta: this.state.quadro[i][this.state.quadro[0].length - 1]})
        }
        else{
            resposta.push({variavel: this.state.quadro[i][0], resposta: parseFloat(this.state.quadro[i][this.state.quadro[0].length - 1])*-1})
        }
        for(var c = 1; c < this.state.quadro[0].length - 1; c++){
            if(resposta.map((r) => {
              return r.variavel  
            }).indexOf(this.state.quadro[0][c]) === -1){
                resposta.push({variavel: this.state.quadro[0][c], resposta: 0})
            }
        }
        this.setState({resposta: resposta})
    }

    carregarResposta = (record, i) => {
        if(record.variavel !== 'Sem resposta'){
            return (
                <div key={i}>
                    {record.variavel} = {record.resposta}
                </div>
            )
        }
        else{
            return (
                <div key={i}>
                    {record.variavel}: {record.resposta}
                </div>
            )
        }
    }

    continuar = () => {
        this.executarSimplexParciais()
        if(!this.verificarParada()){
            this.montarResposta()
            document.getElementById('continuar').style.display = 'none'
        }
    }

    executarSimplex = () => {
        var entrar = this.entraBase()
        var sair = this.sairBase(entrar)

        if(parseInt(localStorage.getItem('max_interacoes')) > this.state.interacoes){
            this.substituirLinhaPivo(entrar, sair)

            this.novoQuadro(entrar, sair)

            if(this.verificarParada()){
                this.executarSimplex()
            }
            else{
                this.montarResposta()
            }
        }
        else{
            this.setState({resposta: [{variavel: 'Sem resposta', resposta: 'Não foi possível encontrar a solução, pois o número de interações não foi suficiente ou a solução é ilimitada.'}]})
        }
    }

    executarSimplexParciais = () => {
        var entrar = this.entraBase()
        var sair = this.sairBase(entrar)

        if(parseInt(localStorage.getItem('max_interacoes')) > this.state.interacoes){
            this.substituirLinhaPivo(entrar, sair)

            this.novoQuadro(entrar, sair)
        }
        else{
            this.setState({resposta: [{variavel: 'Sem resposta', resposta: 'Não foi possível encontrar a solução, pois o número de interações não foi suficiente ou a solução é ilimitada.'}]})
        }
    }

    render() {
        return (
            <>
                <table style={{border: '1px solid black', overflowX: 'auto'}}>
                    <tbody>
                        {this.state.quadro.map(this.carregarQuadro)}
                    </tbody>
                </table>
                {localStorage.getItem('exibir') === 'parciais' ? <button id='continuar' style={{marginTop: '2vh'}} onClick={this.continuar}>Continuar</button> : null}
                <div style={{marginTop: '2vh'}}>
                    {this.state.resposta.length > 0 && <h1>Resposta</h1>}
                    {this.state.resposta.map(this.carregarResposta)}
                    {this.state.resposta.length > 0 && <button style={{marginTop: '2vh'}} onClick={() => {localStorage.clear(); this.props.history.push('/variaveis')}}>Resolver novo simplex</button>}
                </div>
            </>
        );
    }
}

export default Quadros;
