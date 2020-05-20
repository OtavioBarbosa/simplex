
import React from "react";

class Variaveis extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      var_decisao: null,
      restricao: null
    }
  }

  componentDidMount(){
      
  }

  changeVarDecisao = (event) => {
    this.setState({var_decisao: event.target.value})
  }

  changeRestricao = (event) => {
    this.setState({restricao: event.target.value})
  }

  continuar = () => {
    if(this.state.var_decisao && this.state.restricao){
      localStorage.setItem('var_decisao', this.state.var_decisao)
      localStorage.setItem('restricao', this.state.restricao)
      this.props.history.push('/equacoes')
    }
    else{
      alert('Preencha todos os campos')
    }
  }

  render() {
    return (
      <>
        <div>Quantas variáveis de decisão tem o problema? <input style={{width: '8vw'}} type='number' id='var_decisao' onChange={this.changeVarDecisao} /></div>
        <div>Quantas restrições tem o problema? <input style={{width: '8vw'}} type='number' id='restricao' onChange={this.changeRestricao} /></div>
        <button onClick={this.continuar}>Continuar</button>
      </>
    );
  }
}

export default Variaveis;
