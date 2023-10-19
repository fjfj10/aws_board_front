import { Route, Routes } from "react-router-dom";
import RootLayout from "./components/RootLayout/RootLayout";
import Home from "./pages/Home/Home";
import { useQuery } from "react-query";
import { instance } from "./api/config/instance";
import AuthRoute from "./components/Routes/AuthRoute";
import AccountRoute from "./components/Routes/AccountRoute";

function App() {
  // useQuery는 무조건 get요청 ([key값, 디펜던시], 비동기처리, 설정)
  const getPrincipal = useQuery(["getPrincipal"], async () => {
    try {
      const option = {
        headers: {
          Authorization: localStorage.getItem("accessToken")
        }
      }
      // principalRespDto를 응답받음
      return await instance.get("/account/princlpal", option);

    } catch (error) {
      throw new Error(error);
    }
  }, {
    // retry: 요청 실패시 재요청 횟수, refetchInterval: 특정 시간마다 자동 재요청(토큰이 유효한지)
    retry: 0,
    refetchInterval: 1000 * 60 * 10,
    refetchOnWindowFocus: false
  });

  if (getPrincipal.isLoading) {
    return <></>
  }

  return (
    <RootLayout>
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/auth/*" element={ <AuthRoute /> } />
        <Route path="/account/*" element={ <AccountRoute /> } />
        <Route path="/board/:category/" element={ <></> } />
        <Route path="/board/:category/register" element={ <></> } />
        <Route path="/board/:category/edit" element={ <></> } />
      </Routes>
    </RootLayout>
  );
}

export default App;
