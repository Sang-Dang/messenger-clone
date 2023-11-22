import { AppDispatch } from '@/store'
import { useDispatch } from 'react-redux'

type DispatchFunc = () => AppDispatch
const useAppDispatch: DispatchFunc = useDispatch

export default useAppDispatch
