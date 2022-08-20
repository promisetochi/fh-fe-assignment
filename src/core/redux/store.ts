import { configureStore } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { Middleware } from "redux"
import createReducer, { CreateReducerArgs } from "./reducer"
import logger from "redux-logger"

const devMiddlewares = [
  import.meta.env.MODE === "development" ? logger : null,
].filter(Boolean) as Middleware[]

export const createStore = ({}: CreateReducerArgs) => {
  const store = configureStore({
    reducer: createReducer(),
    middleware: [...devMiddlewares],
  })
  return store
}

export type Store = ReturnType<typeof createStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<Store["getState"]>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = Store["dispatch"]
export const useAppDispatch = () => useDispatch<AppDispatch>()
