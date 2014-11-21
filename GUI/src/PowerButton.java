import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.*;

public class PowerButton extends JButton{
	
	//name of button
	String name;
	
	//Size of button
	Dimension size;

	/******************************************
	 * PowerButton
	 * 
	 * Constructor of power button
	 * 
	 * @param name - name of the button
	 ******************************************/
	public PowerButton(String name){
		//Save information
		this.name = name;
		
		//set up button
		setUpButton();
	}
	
	/******************************************
	 * setUpButton
	 * 
	 * Sets up button name, makes visible,
	 * and sets up action listener
	 ******************************************/
	public void setUpButton(){
		//Set name
		this.setText(name);
        //Make visible
        this.setVisible(true);
        //Add action Listener
        this.addActionListener(new PowerButtonActionListener());
	}
	
	public void setSize(Dimension size){
		//save information
		this.size = size;
		
		//Set size
        this.setMaximumSize(size);
        this.setPreferredSize(size);
        this.setMaximumSize(size);
	}

	
	public class PowerButtonActionListener implements ActionListener{
		
        public void actionPerformed(ActionEvent e)
        {
            //Execute when button is pressed
            System.out.println("You clicked the button");
        }

	}
	
	
	
}
