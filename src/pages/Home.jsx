import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { money } from '../assets';
import { CustomButton } from '../components';
import { checkIfImage } from '../utils';


export default function Home() {

    const navigate = useNavigate();
    const [isLoding, setIsLoding] = React.useState(false);
    const [form, setForm] = useState({
        name: '',
        title: '',
        description: '',
        image: '',
        goal: '',
        deadline: '',
    })

    const handelFormFieldChange = (fieldName,e) => {
        setForm({...form, [fieldName]: e.target.value})
    }

    const handelSubmit = () => {

    }

    return(
        <div>
            <FormField 
                labelName ="Your Name"
                placeholder="Enter your name"
                inputType="text"
                value={form.name}
                handelChange={() => {}} 
            />
        </div>
    )

}