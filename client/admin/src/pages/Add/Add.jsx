import React, { useState, useEffect } from 'react';
import './Add.css';
import { assets, url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = () => {
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
    available_toppings: []
  });

  const [image, setImage] = useState(null);
  const [toppings, setToppings] = useState([]);

  useEffect(() => {
    const fetchToppings = async () => {
      try {
        const response = await axios.get(`${url}/topping`);
        if (response.status === 200) {
          setToppings(response.data);
        } else {
          toast.error("Error fetching toppings.");
        }
      } catch (error) {
        toast.error("Error fetching toppings.");
      }
    };
    fetchToppings();
  }, []);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);
    data.available_toppings.forEach(topping => {
      formData.append("toppings[]", topping);
    });

    try {
      const response = await axios.post(`${url}/product`, formData);
      if (response.status === 200) {
        toast.success("Successfully added the product");
        setData({
          name: "",
          description: "",
          price: "",
          category: "coffee",
          available_toppings: []
        });
        setImage(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error adding the product.");
    }
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const onToppingChange = (event) => {
    const { value, checked } = event.target;
    setData(prev => {
      const available_toppings = checked
        ? [...prev.available_toppings, value]
        : prev.available_toppings.filter(topping => topping !== value);
      return { ...prev, available_toppings };
    });
  };

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className='add-img-upload flex-col'>
          <p>Upload image</p>
          <label htmlFor="image">
            <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" />
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
        </div>
        <div className='add-product-name flex-col'>
          <p>Product name</p>
          <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Type here' required />
        </div>
        <div className='add-product-description flex-col'>
          <p>Product description</p>
          <textarea name='description' onChange={onChangeHandler} value={data.description} type="text" rows={6} placeholder='Write content here' required />
        </div>
        <div className='add-category-price'>
          <div className='add-category flex-col'>
            <p>Product category</p>
            <select name='category' onChange={onChangeHandler} value={data.category}>
              <option value="coffee">coffee</option>     
              <option value="tea">tea</option>
              <option value="milktea">milktea</option>
            </select>
          </div>
          <div className='add-price flex-col'>
            <p>Product Price</p>
            <input type="number" name='price' onChange={onChangeHandler} value={data.price} placeholder='$25' required />
          </div>
        </div>
        <div className='add-toppings flex-col'>
          <p>Available Toppings</p>
          <div className='toppings-list'>
            {toppings.map(topping => (
              <label key={topping._id} className='topping-item'>
                <input 
                  type="checkbox" 
                  value={topping._id} 
                  checked={data.available_toppings.includes(topping._id)}
                  onChange={onToppingChange} 
                />
                {topping.name}
              </label>
            ))}
          </div>
        </div>
        <button type='submit' className='add-btn'>ADD</button>
      </form>
    </div>
  );
};

export default Add;
