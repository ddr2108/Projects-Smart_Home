import javax.swing.*;
import java.awt.*;

public class frontEnd extends JFrame{
	
	//App title
	String appTitle = "Smart Home";
	
	//Buttons
	JButton firstButton;
	
	//Output Window
	
	public frontEnd(){
		//set up gui
		GUISetUp();
		
		//Set up Buttons
		buttonSetUp();
		
		//Set up Response box
		responseSetUp();
	}
	
	void GUISetUp(){
		setTitle(appTitle);	//GUI title
		setSize(700,700); // default size is 0,0
		setLocation(50,50); // default is 0,0 (top left corner)
		this.getContentPane().setLayout(new FlowLayout());
	}
	
	void buttonSetUp(){
		JButton button1 = new PowerButton("Turn Light 1");
		add(button1);

	}
	
	void responseSetUp(){
		
		
	}
}
