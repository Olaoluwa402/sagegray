import { Routes, Route, Navigate } from "react-router-dom";
import {
  HomeScreen,
  NotFoundScreen,
  CharacterDetailScreen,
  SearchScreen,
} from "./screens";
import Layout from "./components/Layout/Layout";

const Router = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <HomeScreen />
          </Layout>
        }
      />

      <Route
        path="/about"
        element={
          <Layout>
            <HomeScreen />
          </Layout>
        }
      />

      <Route
        path="/characters"
        element={
          <Layout>
            <HomeScreen />
          </Layout>
        }
      />

      <Route
        path="/search"
        element={
          <Layout>
            <SearchScreen />
          </Layout>
        }
      />

      <Route
        path="/characters/:id"
        element={
          <Layout>
            <CharacterDetailScreen />
          </Layout>
        }
      />

      <Route path="/not-found" element={<NotFoundScreen />} />

      <Route path="*" element={<Navigate to="/not-found" />} />
    </Routes>
  );
};

export default Router;
