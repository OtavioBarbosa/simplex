
import React from "react";

class Equacoes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            funcao_objetiva: [],
            restricoes: []
        }
    }

    componentDidMount(){

        if(!localStorage.getItem('var_decisao') || !localStorage.getItem('restricao')){
            this.props.history.push('/variaveis')
        }

        var funcao_objetiva = []
        var restricoes = []

        for(var i = 0; i < parseInt(localStorage.getItem('var_decisao')); i++){
            funcao_objetiva.push(i+1)
        }
        
        for(var j = 0; j < parseInt(localStorage.getItem('restricao')); j++){
            restricoes.push(j+1)
        }

        this.setState({
            funcao_objetiva: funcao_objetiva,
            restricoes: restricoes
        })
    }

    continuar = () => {
        var continuar = 1
        for(var i = 0; i < parseInt(localStorage.getItem('var_decisao')); i++){
            localStorage.setItem('x' + (i+1), document.getElementById('x' + (i+1)).value)
            if(!document.getElementById('x' + (i+1)).value){
                continuar = 0
            }
        }
        
        for(var j = 0; j < parseInt(localStorage.getItem('restricao')); j++){
            for(var k = 0; k < parseInt(localStorage.getItem('var_decisao')); k++){
                localStorage.setItem('x' + (k+1) + '' + (j+1), document.getElementById('x' + (k+1) + '' + (j+1)).value)
                if(!document.getElementById('x' + (k+1) + '' + (j+1)).value){
                    continuar = 0
                }
            }
            localStorage.setItem('b' + (j+1), document.getElementById('b' + (j+1)).value)
            if(!document.getElementById('b' + (j+1)).value){
                continuar = 0
            }
        }

        if(continuar === 1){
            this.props.history.push('/quadros')
        }
        else{
            alert('Preencher todos os campos')
        }
    }

  render() {
    return (
      <>
        <div id='funcao_objetiva'> 
            Função: 
            {
                this.state.funcao_objetiva.map((valor, index) => {
                    if(valor === this.state.funcao_objetiva.length){
                        return <label key={valor} style={{margin: '0.2vw'}}>
                                    <input style={{width: '8vw'}} type='number' id={'x' + valor} /> X{valor}
                                </label>
                    }
                    else{
                        return <label key={valor} style={{margin: '0.2vw'}}>
                                    <input style={{width: '8vw'}} type='number' id={'x' + valor} /> X{valor} +
                                </label>
                    }
                })
            }
        </div>
        <div id='restricoes' style={{marginBottom: '1vh', marginTop: '2vh'}}>
            Restrições: <br/>
            {
                this.state.restricoes.map((valorRestricao, indice) => {
                    return <div key={valorRestricao} style={{marginBottom: '1vh'}}>
                                {
                                    this.state.funcao_objetiva.map((valor, index) => {
                                        if(valor === this.state.funcao_objetiva.length){
                                            return <label key={valor} style={{margin: '0.2vw'}}>
                                                        <input style={{width: '8vw'}} type='number' id={'x' + valor + valorRestricao} /> X{valor} 
                                                        {' <= '} <input style={{width: '8vw'}} type='number' id={'b' + valorRestricao} />
                                                    </label>
                                        }
                                        else{
                                            return <label key={valor} style={{margin: '0.2vw'}}>
                                                        <input style={{width: '8vw'}} type='number' id={'x' + valor + valorRestricao} /> X{valor} +
                                                    </label>
                                        }
                                    })
                                }
                            </div>
                })
            }
        </div>

        <button onClick={this.continuar}>Continuar</button>
      </>
    );
  }
}

export default Equacoes;
