import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { RootState, storeDispatch } from "~services/state/store";

export const useAppSelector:TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<storeDispatch>();