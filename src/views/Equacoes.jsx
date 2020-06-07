
import React from "react";

class Equacoes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            funcao_objetiva: [],
            restricoes: [],
            objetivo: 'max',
            exibir: 'resultado',
            max_interacoes: 1,
            resolver: false
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
    
    changeObjetivo = (event) => {
        this.setState({objetivo: event.target.value})
    }

    changeExibir = (event) => {
        this.setState({exibir: event.target.value})
    }

    changeMaxInteracoes = (event) => {
        if(parseFloat(event.target.value) <= 0){
            alert('Quantidade de interações deve ser maior que 0')
        }
        else{
            this.setState({max_interacoes: event.target.value})
        }
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

        localStorage.setItem('objetivo', this.state.objetivo)
        localStorage.setItem('exibir', this.state.exibir)
        if(parseFloat(this.state.max_interacoes) <= 0 || !this.state.max_interacoes){
            continuar = 2
        }
        localStorage.setItem('max_interacoes', this.state.max_interacoes)

        if(continuar === 1){
            this.props.history.push('/quadros')
        }
        else if(continuar === 0){
            alert('Preencher todos os campos')
        }
        else{
            alert('Quantidade de interações deve ser maior que 0 ou diferente de vazio')
        }
    }

  render() {
    return (
      <>
        <div style={{marginBottom: '2vh'}}>Objetivo? 
          <select style={{margin: '0.2vh'}} defaultValue={this.state.objetivo} onChange={this.changeObjetivo}>
            <option value='max'>Maximizar</option>
            <option value='min'>Minimizar</option>
          </select>
        </div>
        <div style={{marginBottom: '2vh'}}>Exibir? 
          <select style={{margin: '0.2vh'}} defaultValue={this.state.exibir} onChange={this.changeExibir}>
            <option value='resultado'>Resultado</option>
            <option value='parciais'>Soluções parciais</option>
          </select>
        </div>
        <div style={{marginBottom: '2vh'}}>Quantidade de interações? 
          <input type='number' style={{margin: '0.2vh'}} defaultValue={this.state.max_interacoes} onChange={this.changeMaxInteracoes} />
        </div>
        <div id='funcao_objetiva'> 
            Função: 
            {
                this.state.funcao_objetiva.map((valor, index) => {
                    if(valor === this.state.funcao_objetiva.length){
                        return <label key={valor} style={{margin: '0.2vw'}}>
                                    <input style={{width: '10vw'}} type='number' id={'x' + valor} /> X{valor}
                                </label>
                    }
                    else{
                        return <label key={valor} style={{margin: '0.2vw'}}>
                                    <input style={{width: '10vw'}} type='number' id={'x' + valor} /> X{valor} +
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
                                                        <input style={{width: '10vw'}} type='number' id={'x' + valor + valorRestricao} /> X{valor} 
                                                        {' <= '} <input style={{width: '12vw'}} type='number' id={'b' + valorRestricao} onChange={(evento) => {
                                                            if(parseFloat(evento.target.value) < 0){
                                                                alert('Soluções ilimitadas')
                                                                document.getElementById('b' + valorRestricao).value = ''
                                                                this.setState({resolver: true})
                                                            }
                                                        }}/>
                                                    </label>
                                        }
                                        else{
                                            return <label key={valor} style={{margin: '0.2vw'}}>
                                                        <input style={{width: '10vw'}} type='number' id={'x' + valor + valorRestricao} /> X{valor} +
                                                    </label>
                                        }
                                    })
                                }
                            </div>
                })
            }
        </div>
        <div style={{marginBottom: '1.5vh'}}>
            {
                this.state.funcao_objetiva.map((valor, index) => {
                    if(valor === this.state.funcao_objetiva.length){
                        return <label key={valor} style={{margin: '0.2vw'}}>X{valor} >= 0 </label>
                    }
                    else{
                        return <label key={valor} style={{margin: '0.2vw'}}>X{valor},</label>
                    }
                })
            }
        </div>
        <button onClick={this.continuar}>Continuar</button>
        {this.state.resolver && <button style={{marginTop: '2vh'}} onClick={() => {localStorage.clear(); this.props.history.push('/variaveis')}}>Resolver novo simplex</button>}
      </>
    );
  }
}

export default Equacoes;
