import ComponentInterface from "../base/ComponentInterface";
import TabNav from "./TabNav";
import TabPage from "./TabPage";

export default interface TabInterface extends ComponentInterface {
	
	activeIndex?	: number;
	transition?		: string;

	nav?	: TabNav;
	pages?	: Array<TabPage>;

}