
import Variaveis from "./views/Variaveis.jsx";
import Equacoes from "./views/Equacoes.jsx";
import Quadros from "./views/Quadros.jsx";
import Analise from "./views/Analise.jsx";

var routes = [
  {
    path: "/",
    name: "Simplex Variáveis",
    icon: "",
    component: Variaveis,
    layout: "/"
  },
  {
    path: "variaveis",
    name: "Simplex Variáveis",
    icon: "",
    component: Variaveis,
    layout: "/"
  },
  {
    path: "equacoes",
    name: "Simplex Equações",
    icon: "",
    component: Equacoes,
    layout: "/"
  },
  {
    path: "quadros",
    name: "Simplex Quadros",
    icon: "",
    component: Quadros,
    layout: "/"
  },
  {
    path: "analise",
    name: "Análise de sensibilidade",
    icon: "",
    component: Analise,
    layout: "/"
  }
];

export default routes;
